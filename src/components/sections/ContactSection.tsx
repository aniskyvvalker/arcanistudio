import { useState, useRef, useLayoutEffect, useEffect } from 'react'
import { ArrowRight, ArrowLeft, ArrowUpRight, Check } from 'lucide-react'
import { actions } from 'astro:actions'
import Cal, { getCalApi } from '@calcom/embed-react'
import { ui, defaultLang, type Lang } from '../../i18n/ui'

// Meta Pixel global — injected by MetaPixel.astro (queued/no-op until it
// loads, see that file). Optional because it's absent in dev/when unset.
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

// The selection field each wizard step writes to. Index-aligned with
// ui[lang].contact.choiceSteps — kept separate from copy because it's logic.
const FIELDS = ['project', 'timeline', 'company', 'budget'] as const
type ContactCopy = (typeof ui)[Lang]['contact']

// cal.com embed wants the path only ("arcani/book"), but PUBLIC_CALCOM_URL holds
// the full URL ("https://cal.com/arcani/book"). Strip to the path. Empty = no
// cal configured → we fall back to the static success screen.
const CAL_LINK = (() => {
  const url = import.meta.env.PUBLIC_CALCOM_URL
  if (!url) return ''
  try { return new URL(url).pathname.replace(/^\/+|\/+$/g, '') } catch { return '' }
})()

/* ============================================================================
 * CONTACT SECTION  —  multi-step lead form (React island, client:load)
 * ============================================================================
 *
 * A 5-step wizard that qualifies a lead, then submits it to the server.
 *
 *   Steps 0–3  ChoiceStep  — single-select questions, driven by CHOICE_STEPS:
 *                0 project (step 0 also has the "Something else" free-text input)
 *                1 timeline
 *                2 company / team size
 *                3 budget
 *   Step 4     ContactStep — name / email / phone / business + submit.
 *
 * SUBMIT  → actions.submitLead(...)  (see src/actions/index.ts)
 *   On success: shows the "We'll be in touch" screen (the `sent` branch).
 *   On failure: inline error message in ContactStep, form stays put.
 *
 * STATE OWNERSHIP: this parent owns ALL state. ChoiceStep / ContactStep are
 * presentational and receive values + callbacks. Keep it that way — it's why
 * the step animation (animKey) can re-trigger without losing answers.
 *
 *
 * WHERE THIS FITS THE BIGGER FUNNEL (full plan: src/actions/index.ts header)
 * -------------------------------------------------------------------------
 * Goal = book a 30-min call. Algeria-focused → phone/WhatsApp over email.
 *
 * WHAT'S MISSING HERE  🚧  (future session, look for the `TODO(funnel)` marks)
 *   [ ] On success, REDIRECT to cal.com "Event 2" (qualified, no-questions,
 *       prefilled name+email) instead of just showing the static screen.
 *       The link will come from import.meta.env.PUBLIC_CALCOM_URL. See the
 *       TODO(funnel) marker in submit() below for exactly where to add it.
 *   [ ] WhatsApp follow-up for people who don't self-book — currently manual
 *       (we read the phone from the email/Telegram notification). A bot to
 *       automate this is planned.
 *
 * GOTCHA: leads only actually reach us if the server env vars are set
 * (Resend and/or Telegram). Without them the form still "succeeds" but the
 * lead goes nowhere. See .env.example.
 * ========================================================================== */

// Step config (questions + options), budget brackets per project, and the
// business-size variant all come from ui[lang].contact. The wizard logic keys
// off the locale's own sentinel labels (c.somethingElse, c.managementKey) so it
// keeps working in any language.

type Selections = { project: string; company: string; budget: string; timeline: string }
type Contact = { name: string; email: string; phone: string; business: string; message: string }
type ChoiceConfig = { question: string; options: string[] }

// Glues the last word to a trailing "?" with a non-breaking space so the
// question mark never wraps onto its own line — the last word wraps with it.
function glueLastWord(text: string) {
  const lastSpace = text.lastIndexOf(' ')
  if (lastSpace === -1) return text
  return `${text.slice(0, lastSpace)} ${text.slice(lastSpace + 1)}`
}

export default function ContactSection({ lang = defaultLang }: { lang?: Lang }) {
  const tc = ui[lang].contact
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState<'fwd' | 'bwd'>('fwd')
  const [animKey, setAnimKey] = useState(0)
  const [selections, setSelections] = useState<Selections>({ project: '', company: '', budget: '', timeline: '' })
  const [otherText, setOtherText] = useState('')
  const [contact, setContact] = useState<Contact>({ name: '', email: '', phone: '', business: '', message: '' })
  const [honeypot, setHoneypot] = useState('')
  const [sent, setSent] = useState(false)
  const [showCal, setShowCal] = useState(false) // gates the cal.com embed behind a click on the success screen
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const backRef = useRef<HTMLButtonElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [backWidth, setBackWidth] = useState(0)

  useLayoutEffect(() => {
    if (backRef.current) setBackWidth(backRef.current.offsetWidth)
  }, [])

  // When the success screen replaces the wizard, the user may still be
  // scrolled down to wherever the ContactStep form was (mid-page on tall
  // viewports). Snap the section back to the top so the "We'll be in touch"
  // heading is visible instead of landing mid-scroll. -80px clears the fixed
  // navbar (h-12 + top-4, see Navbar.astro) plus a little breathing room.
  useEffect(() => {
    if (!sent || !sectionRef.current) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const top = sectionRef.current.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' })
  }, [sent])

  const TOTAL = 5

  function navigate(next: number) {
    setDir(next > step ? 'fwd' : 'bwd')
    setStep(next)
    setAnimKey(k => k + 1)
  }

  function pick(field: keyof Selections, value: string) {
    // The budget step (BUDGET_BY_PROJECT) AND the company step (goal vs
    // business-size, see BUSINESS_SIZE_STEP) both depend on the chosen project.
    // If the project changes, any previously-picked budget/company answer belongs
    // to the old variant — clear both so a stale value can't be carried/submitted.
    setSelections(s => ({
      ...s,
      [field]: value,
      ...(field === 'project' && value !== s.project ? { budget: '', company: '' } : {}),
    }))
    if (value !== tc.somethingElse) setTimeout(() => navigate(step + 1), 150)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    let next = value
    // Light input filtering as the user types:
    //  - name: strip digits (letters, spaces, -, ' still allowed).
    //  - phone: strip letters (digits, +, spaces, -, () still allowed for formats).
    if (name === 'name') next = next.replace(/[0-9]/g, '')
    if (name === 'phone') next = next.replace(/[A-Za-z]/g, '')
    setContact(c => ({ ...c, [name]: next }))
  }

  // Returns a friendly error string covering ALL invalid fields at once, or ''
  // if the contact details look valid. Mirrors (loosely) the server's leadSchema
  // so the user gets clean feedback before we ever submit. Kept intentionally
  // lenient — the server is the real gate.
  function validateContact(contact: Contact): string {
    const v = tc.validation
    const errs: string[] = []
    if (contact.name.trim().length < 3) errs.push(v.name)
    const email = contact.email.trim()
    // Charset mirrors the server's zod .email() closely enough that anything this
    // accepts also passes server-side — otherwise a user can clear this check and
    // still get bounced by the server with only the generic fallback message.
    if (email.length < 8 || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) errs.push(v.email)
    if (contact.phone.trim().length < 8) errs.push(v.phone)
    if (errs.length === 0) return ''
    const list =
      errs.length === 1 ? errs[0] : `${errs.slice(0, -1).join(v.sep)}${v.and}${errs[errs.length - 1]}`
    const suffix = errs.length === 1 ? v.suffixSingle : v.suffixMulti
    return `${v.intro}${list}${suffix}`
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return // guard against double-submit / rapid Enter

    // Client-side validation first → friendly message, and we never even hit the
    // server with bad data. The server still re-validates (security), but its raw
    // Zod errors must NEVER reach the user — see the fallback below.
    const friendly = validateContact(contact)
    if (friendly) {
      setError(friendly)
      return
    }

    setSubmitting(true)
    setError('')

    // Shared between the browser pixel's fbq() call below and the server's
    // Meta CAPI call (src/actions/index.ts) so Meta dedupes the two into one
    // Lead event instead of double-counting this single submission.
    const eventId = crypto.randomUUID()

    // Field names here MUST match leadSchema in src/actions/index.ts.
    // For "Something else", we send the free-text (otherText) as the project.
    const { data, error } = await actions.submitLead({
      project: selections.project === tc.somethingElse ? otherText : selections.project,
      timeline: selections.timeline,
      company: selections.company,
      budget: selections.budget,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      business: contact.business,
      message: contact.message,
      company_website: honeypot, // honeypot — real users leave this empty
      lang, // controls the language of the Telegram/email notification, not stored on the lead
      eventId,
      pageUrl: window.location.href,
    })

    setSubmitting(false)
    if (error || !data?.ok) {
      // The server writes English messages; we map its ActionError codes to the
      // active locale here. Astro's INPUT validation error dumps raw Zod JSON in
      // `error.message` — never show that, so anything that isn't a known code
      // falls through to the generic line.
      const code = error && 'code' in error ? error.code : undefined
      const safe =
        code === 'TOO_MANY_REQUESTS' ? tc.errorRate
          : code === 'INTERNAL_SERVER_ERROR' ? tc.errorServer
            : tc.errorGeneric
      setError(safe)
      return
    }

    // Lead already reached us (Telegram/email) via the action above. Booking is
    // all that's left — show it IN-PAGE: the sent branch renders an inline
    // cal.com embed (prefilled), so the user never leaves the site. Falls back to
    // the static success screen when PUBLIC_CALCOM_URL is unset (CAL_LINK empty).
    // eventID here must match the `eventId` sent to submitLead above — that's
    // what lets Meta dedupe this browser-side event against the server-side
    // Conversions API one for the same submission.
    window.fbq?.('track', 'Lead', {}, { eventID: eventId })
    setSent(true)
  }

  // Success state. CALLBACK IS PRIMARY (matches the audience: low digital
  // awareness, WhatsApp/phone converts best) — we lead with the reassurance that
  // we'll reach out. Self-service cal.com booking is demoted to an OPTIONAL
  // express lane below, for the eager few who want to lock a slot now. Booking is
  // never a gate: the lead already reached us via the action before this screen.
  if (sent) {
    return (
      <section id="contact" ref={sectionRef} className="bg-palette-950 px-6 pt-32 pb-24 md:px-12">
        <div className="mx-auto max-w-[1000px]">
          <h2 className="font-reckless font-light italic text-white leading-[1.05]" style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}>
            {tc.sentHeading}<span style={{ color: '#F94500' }}>.</span>
          </h2>
          <p className="mt-5 text-palette-300 text-[15px] max-w-md leading-relaxed">
            {tc.sentBody}
          </p>

          {/* Optional express lane — only when cal.com is configured */}
          {CAL_LINK && (
            <div className="mt-16 border-t border-palette-800/60 pt-12">
              <p className="text-[13px] font-medium text-palette-400 tracking-widest uppercase">
                {tc.expressEyebrow}
              </p>
              <p className="mt-3 text-palette-300 text-[15px] max-w-md leading-relaxed">
                {tc.expressBody}
              </p>
              {showCal ? (
                <div className="mt-8">
                  <CalEmbed name={contact.name} email={contact.email} phone={contact.phone} />
                </div>
              ) : (
                <button
                  onClick={() => setShowCal(true)}
                  className="group mt-7 inline-flex items-center gap-3 rounded-full border border-palette-700 h-12 pl-6 pr-5 text-[16px] font-normal text-palette-300 hover:border-palette-500 hover:text-white transition-colors duration-200"
                >
                  {tc.bookNow}
                  <ArrowRight size={20} strokeWidth={1.5} className="transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    )
  }

  return (
    <section id="contact" ref={sectionRef} className="bg-palette-950 overflow-x-clip">

      {/* Progress bar + step counter */}
      <div className="px-6 pt-32 md:px-12">
        <div className="mx-auto max-w-[900px]">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-[11px] font-medium text-palette-600 tabular-nums tracking-widest uppercase shrink-0">
              {tc.step} {step + 1} {tc.of} {TOTAL}
            </span>
            <div
              className="flex flex-1 gap-1.5"
              role="progressbar"
              aria-label={`${tc.step} ${step + 1} ${tc.of} ${TOTAL}`}
              aria-valuenow={step}
              aria-valuemin={0}
              aria-valuemax={TOTAL}
            >
              {Array.from({ length: TOTAL }).map((_, i) => (
                <div key={i} className="h-[4px] flex-1 rounded-full bg-palette-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: i < step ? '100%' : '0%', backgroundColor: '#F94500' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[900px] px-6 md:px-12" style={{ paddingTop: 'clamp(20px, calc(-2.85px + 6.528vw), 64px)', paddingBottom: 'clamp(64px, calc(43.49px + 5.128vw), 96px)' }}>

        {/* Animated step content only */}
        <div key={animKey} className={dir === 'fwd' ? 'step-enter-fwd' : 'step-enter-bwd'}>
          {step < 4 ? (
            <ChoiceStep
              config={
                FIELDS[step] === 'budget'
                  ? {
                      ...tc.choiceSteps[step],
                      question: selections.project === tc.managementKey ? tc.budgetQuestionManagement : tc.choiceSteps[step].question,
                      options: tc.budgetByProject[selections.project] ?? tc.choiceSteps[step].options,
                    }
                  : FIELDS[step] === 'company' && selections.project === tc.managementKey
                    ? tc.businessSizeStep
                    : tc.choiceSteps[step]
              }
              selected={selections[FIELDS[step]]}
              onPick={(val) => pick(FIELDS[step], val)}
              otherText={step === 0 ? otherText : undefined}
              onOtherChange={step === 0 ? setOtherText : undefined}
              somethingElse={tc.somethingElse}
              otherPlaceholder={tc.otherPlaceholder}
            />
          ) : (
            <ContactStep
              contact={contact}
              onChange={handleChange}
              onSubmit={submit}
              canSubmit={!!(contact.name && contact.email && contact.phone)}
              submitting={submitting}
              error={error}
              honeypot={honeypot}
              onHoneypotChange={setHoneypot}
              onBack={() => navigate(3)}
              tc={tc}
              lang={lang}
            />
          )}
        </div>

        {/* Navigation buttons — outside animated wrapper so they don't re-animate */}
        {step < 4 && (
          <div className="mt-10 flex items-center gap-4">
            <div
              className="overflow-hidden transition-[max-width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ maxWidth: step > 0 ? `${backWidth}px` : '0px' }}
            >
              <button
                ref={backRef}
                onClick={() => navigate(step - 1)}
                className="group flex items-center gap-3 rounded-full border border-palette-700 h-12 pl-5 pr-6 text-[16px] font-normal text-palette-300 whitespace-nowrap hover:border-palette-500 hover:text-white transition-[transform,border-color,color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ transform: step > 0 ? 'translateX(0)' : `translateX(-${backWidth}px)` }}
              >
                <ArrowLeft size={16} strokeWidth={1.5} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
                {tc.back}
              </button>
            </div>
            <button
              onClick={() => navigate(step + 1)}
              disabled={!selections[FIELDS[step]] || (selections[FIELDS[step]] === tc.somethingElse && otherText.trim().length < 3)}
              className="group flex items-center gap-3 rounded-full h-12 pl-6 pr-5 text-[16px] font-normal transition-[background-color,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ backgroundColor: selections[FIELDS[step]] ? '#F94500' : '#262626', color: '#fff' }}
            >
              {tc.continue}
              <ArrowRight size={20} strokeWidth={1.5} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes stepInFwd {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes stepInBwd {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .step-enter-fwd, .step-enter-bwd { will-change: transform, opacity; backface-visibility: hidden; transform: translateZ(0); }
        .step-enter-fwd { animation: stepInFwd 0.45s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .step-enter-bwd { animation: stepInBwd 0.45s cubic-bezier(0.22, 1, 0.36, 1) both; }
        @media (prefers-reduced-motion: reduce) {
          .step-enter-fwd, .step-enter-bwd { animation: none; }
        }
      `}</style>
    </section>
  )
}

// Inline cal.com booking calendar — rendered in the success state so the user
// books without leaving the site. Dark-themed to match, brand color on accents,
// name+email prefilled from the form so they don't retype.
//
// ── Duplicate-booking detection is by EMAIL (confirmed 2026-07-03) ──────────
// If the same visitor books twice for this event type, cal.com shows a
// "you already have a booking, reschedule instead?" banner. Tested directly:
// it's keyed on the attendee's EMAIL, not name or phone — submitting the same
// email again triggers it regardless of name/phone; a different email does
// not. Relevant if this form's prefill or a future "resubmit" flow ever needs
// to reason about what counts as "the same lead" from cal.com's perspective.
//
// ── Widget LANGUAGE (why it's not driven by `lang`) ─────────────────────────
// The embedded cal.com widget renders in the cal.com ACCOUNT owner's language
// (cal.com dashboard → Settings → General → Language). It does NOT read the
// visitor's browser language, and there is NO free-plan URL/config param to
// override it per-embed (we tried threading `language: lang` into the config
// below — cal.com ignores it). Per-event-type language override is an open,
// UNSHIPPED cal.com feature request, so paid plans don't solve it today either.
//   Refs: github.com/calcom/cal.com/issues/8706  (per-event-type language)
//         github.com/calcom/cal.com/issues/18710 (enforce booking-page language)
//         github.com/calcom/cal.com/issues/20643 (embed follows account language)
//
// CURRENT STATE: the cal.com account is set to French, so BOTH the /fr and /en
// pages show a French widget. Accepted on purpose — the audience is FR/Algeria-
// dominant, and date/time/Confirm read fine even for the rare EN visitor.
//
// ── If you later want a real EN widget + FR widget (2-account approach) ──────
// One cal.com account = one language, so a true per-locale split needs TWO
// cal.com accounts, each set to its own language, each with its own event link:
//   1. Create a 2nd cal.com account (e.g. an EN one); set its Language = English.
//      Keep the existing account on French. Connect both to your calendar so
//      availability stays in sync (or accept two calendars to watch).
//   2. Expose two booking URLs via env, e.g.
//         PUBLIC_CALCOM_URL_FR = https://cal.com/arcani/book       (French acct)
//         PUBLIC_CALCOM_URL_EN = https://cal.com/arcani-en/book    (English acct)
//      and build CAL_LINK (top of file) from the one matching `lang` instead of
//      the single PUBLIC_CALCOM_URL.
//   3. Thread `lang` down to <CalEmbed> and pick the calLink by locale.
// Trade-off: 2 logins, 2 availability/no-show configs to maintain. Only worth it
// if EN leads grow enough that a French widget actually costs bookings.
// Cal's phone widget needs E.164 (leading "+" + country code) or it can't
// determine the country and shows a garbage "+0" flag. Our input just strips
// letters (see handleChange), so a raw local number like "0636661023" has no
// "+" yet. Strip formatting chars and default the country to +213 (Algeria —
// our target audience per the placeholder "+213 ...") when the user didn't
// type one.
function toE164(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '')
  if (digits.startsWith('+')) return digits
  // User typed the country code without a leading "+" (e.g. "213 656 661 023").
  // Don't prepend +213 again — that would double it up.
  if (digits.startsWith('213')) return `+${digits}`
  return `+213${digits.replace(/^0+/, '')}`
}

function CalEmbed({ name, email, phone }: { name: string; email: string; phone: string }) {
  useEffect(() => {
    let active = true
    ;(async () => {
      const cal = await getCalApi()
      if (!active) return
      cal('ui', {
        theme: 'dark',
        cssVarsPerTheme: { dark: { 'cal-brand': '#F94500' } },
        hideEventTypeDetails: false,
      })
    })()
    return () => { active = false }
  }, [])

  return (
    <Cal
      calLink={CAL_LINK}
      style={{ width: '100%', height: '100%', minHeight: '640px', overflow: 'scroll' }}
      config={{ name, email, attendeePhoneNumber: toE164(phone), theme: 'dark' }}
    />
  )
}

// Renders an option label, keeping any trailing "(...)" group unbreakable: it
// wraps to the next line as a whole rather than splitting (e.g. never "(ERP /"
// on one line and "CRM)" on the next). Data string stays clean — display only.
function renderOptionLabel(option: string) {
  const idx = option.indexOf(' (')
  if (idx === -1) return option
  return (
    <>
      {option.slice(0, idx)}{' '}
      <span className="whitespace-nowrap">{option.slice(idx + 1)}</span>
    </>
  )
}

function ChoiceStep({
  config, selected, onPick, otherText, onOtherChange, somethingElse, otherPlaceholder,
}: {
  config: ChoiceConfig
  selected: string
  onPick: (val: string) => void
  otherText?: string
  onOtherChange?: (val: string) => void
  somethingElse: string
  otherPlaceholder: string
}) {
  return (
    <div>
      <h2
        className="font-reckless font-light italic text-white leading-[1.05] mb-10"
        style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}
      >
        {glueLastWord(config.question)}
      </h2>

      <ol className="divide-y divide-palette-800/60" role="list">
        {config.options.map((option, i) => {
          const isActive = selected === option
          const isSomethingElse = option === somethingElse
          const showInput = isSomethingElse && isActive && onOtherChange !== undefined
          return (
            <li key={option}>
              <div
                className="group w-full flex items-center gap-6 py-5 cursor-pointer"
                onClick={() => !showInput && onPick(option)}
              >
                <span
                  className="tabular-nums text-[13px] w-6 shrink-0 transition-colors duration-150"
                  style={{ color: isActive ? '#F94500' : '#525252' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                {showInput ? (
                  <input
                    autoFocus
                    type="text"
                    value={otherText ?? ''}
                    onChange={e => onOtherChange(e.target.value)}
                    onClick={e => e.stopPropagation()}
                    maxLength={200}
                    placeholder={otherPlaceholder}
                    className="flex-1 bg-transparent text-white font-light placeholder:text-palette-700 focus:outline-none"
                    style={{ fontSize: 'clamp(18px, 2.5vw, 24px)' }}
                  />
                ) : (
                  <span
                    className="flex-1 font-light transition-colors duration-150"
                    style={{
                      fontSize: 'clamp(18px, 2.5vw, 24px)',
                      color: isActive ? '#ffffff' : '#A1A1A1',
                    }}
                  >
                    {renderOptionLabel(option)}
                  </span>
                )}
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-200"
                  style={{
                    backgroundColor: isActive ? '#F94500' : 'transparent',
                    border: isActive ? '1.5px solid #F94500' : '1.5px solid #404040',
                  }}
                >
                  {isActive && <Check size={11} strokeWidth={2.5} color="#fff" />}
                </span>
              </div>
            </li>
          )
        })}
        <li className="border-t border-palette-800/60" />
      </ol>
    </div>
  )
}

function ContactStep({
  contact, onChange, onSubmit, canSubmit, submitting, error, honeypot, onHoneypotChange, onBack, tc, lang,
}: {
  contact: Contact
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent) => void
  canSubmit: boolean
  submitting: boolean
  error: string
  honeypot: string
  onHoneypotChange: (val: string) => void
  onBack: () => void
  tc: ContactCopy
  lang: Lang
}) {
  return (
    <div>
      <h2
        className="font-reckless font-light italic text-white leading-[1.05] mb-10"
        style={{ fontSize: 'clamp(40px, 7vw, 80px)' }}
      >
        {tc.almostThere}
      </h2>

      <form onSubmit={onSubmit} className="flex flex-col">
        {/* Honeypot — hidden from humans, bots tend to fill it. Server rejects if non-empty. */}
        <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
          <label>
            {tc.companyWebsiteLabel}
            <input
              type="text"
              name="company_website"
              tabIndex={-1}
              autoComplete="off"
              maxLength={200}
              value={honeypot}
              onChange={(e) => onHoneypotChange(e.target.value)}
            />
          </label>
        </div>

        <div className="grid sm:grid-cols-2 border-t border-palette-800/60">
          {/* maxLength = UX caps (tighter than the server's leadSchema in
              src/actions/index.ts, which stays the security backstop). */}
          <InputField label={tc.fields.name.label} name="name" type="text" value={contact.name} onChange={onChange} required maxLength={50} placeholder={tc.fields.name.placeholder} className="border-b sm:border-r border-palette-800/60 pr-0 sm:pr-8" />
          <InputField label={tc.fields.email.label} name="email" type="email" value={contact.email} onChange={onChange} required maxLength={50} placeholder={tc.fields.email.placeholder} className="border-b border-palette-800/60 pl-0 sm:pl-8" />
          <InputField label={tc.fields.phone.label} name="phone" type="tel" value={contact.phone} onChange={onChange} required maxLength={40} placeholder={tc.fields.phone.placeholder} className="border-b sm:border-b-0 sm:border-r border-palette-800/60 pr-0 sm:pr-8" />
          <InputField label={tc.fields.business.label} name="business" type="text" value={contact.business} onChange={onChange} maxLength={200} placeholder={tc.fields.business.placeholder} className="border-b border-palette-800/60 pl-0 sm:pl-8" />
        </div>

        {/* Message field — hidden, uncomment to restore
        <div className="border-t border-palette-800/60 py-6">
          <label className="block text-[11px] font-medium text-palette-600 mb-4 tracking-widest uppercase">
            Tell us about the project
          </label>
          <textarea
            name="message"
            value={contact.message}
            onChange={onChange}
            rows={5}
            placeholder="Goals, timeline, context — anything that helps us understand what you need."
            className="w-full bg-transparent text-white text-[15px] font-light leading-relaxed placeholder:text-palette-700 focus:outline-none resize-none"
          />
        </div>
        */}

        <div className="border-t border-palette-800/60 pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <p className={`text-[14px] leading-relaxed ${lang === 'fr' ? 'max-w-[365px]' : 'max-w-xs'}`} style={{ color: error ? '#F94500' : undefined }}>
            {error ? error : (
              <span className="text-palette-500">{tc.reassure}</span>
            )}
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBack}
              className="group flex items-center gap-3 rounded-full border border-palette-700 h-12 pl-5 pr-6 text-[16px] font-normal text-palette-300 whitespace-nowrap hover:border-palette-500 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft size={16} strokeWidth={1.5} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
              {tc.back}
            </button>
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="group inline-flex shrink-0 items-center gap-3 rounded-full h-12 pl-5 pr-[13px] text-[16px] font-normal transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#F94500', color: '#fff' }}
            >
              {submitting ? tc.sending : tc.send}
              <span className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-white/15">
                <ArrowUpRight size={20} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-5 group-hover:-translate-y-5" />
                <ArrowUpRight size={20} strokeWidth={1.5} className="absolute -translate-x-5 translate-y-5 transition-transform duration-500 group-hover:translate-x-0 group-hover:translate-y-0" />
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

function InputField({
  label, name, type, value, onChange, required, maxLength, placeholder, className = '',
}: {
  label: string; name: string; type: string; value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean; maxLength?: number; placeholder?: string; className?: string
}) {
  return (
    <label className={`block py-6 ${className}`}>
      <span className="block text-[13px] font-medium text-palette-400 mb-3 tracking-widest uppercase">
        {label}
      </span>
      <input
        type={type} name={name} value={value} onChange={onChange} required={required}
        maxLength={maxLength}
        placeholder={placeholder ?? label}
        className="w-full bg-transparent text-white text-[15px] font-light placeholder:text-palette-600 focus:outline-none"
      />
    </label>
  )
}
