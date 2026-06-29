import { useState, useRef, useLayoutEffect, useEffect } from 'react'
import { ArrowRight, ArrowLeft, ArrowUpRight, Check } from 'lucide-react'
import { actions } from 'astro:actions'
import Cal, { getCalApi } from '@calcom/embed-react'

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

const CHOICE_STEPS = [
  {
    question: "What are you building?",
    field: 'project' as const,
    // FR: ['Site vitrine / Landing page', 'Boutique en ligne', 'Logiciel de gestion sur mesure (ERP / CRM)', 'Application web / mobile', 'Autre']
    options: ['Business website / Landing page', 'Online store', 'Custom management software (ERP / CRM)', 'Web / mobile app', 'Something else'],
  },
  {
    question: "When do you need it?",
    field: 'timeline' as const,
    // FR: ['Le plus tôt possible', '1 – 3 mois', '3 – 6 mois', "Je m'informe pour l'instant"]
    options: ['As soon as possible', '1 – 3 months', '3 – 6 months', 'Just exploring options'],
  },
  {
    // DEFAULT for this step. Overridden at render to BUSINESS_SIZE_STEP when the
    // project is "Management software" (headcount drives the quote there — users,
    // seats, roles; for everyone else the goal is the more useful signal). Both
    // reuse the 'company' slot/server field.
    question: "What's your main goal?",
    field: 'company' as const,
    // FR: ['Avoir plus de clients', 'Vendre en ligne', 'Paraître professionnel et crédible', 'Remplacer un site existant']
    options: ['Get more customers', 'Sell online', 'Look professional & credible', 'Replace something old'],
  },
  {
    question: "What's your budget?",
    field: 'budget' as const,
    // Options are OVERRIDDEN at render time per the project chosen in step 0
    // (see BUDGET_BY_PROJECT below). These are the fallback (used for
    // "Something else" / unknown project).
    options: ['Under 100,000 DZD', '100,000 – 300,000 DZD', '300,000 – 800,000 DZD', '800,000 DZD and above'],
  },
]

// Budget brackets in DZD, tailored to each project type from step 0. A landing
// page and a custom app are not the same money — showing one set for all either
// scares small buyers or under-quotes big ones. Key = exact project option label
// from CHOICE_STEPS[0]. Fallback = the budget step's own `options` above.
const BUDGET_BY_PROJECT: Record<string, string[]> = {
  'Business website / Landing page': ['Under 50,000 DZD', '50,000 – 120,000 DZD', '120,000 – 250,000 DZD', '250,000 DZD and above'],
  'Online store': ['Under 100,000 DZD', '100,000 – 250,000 DZD', '250,000 – 600,000 DZD', '600,000 DZD and above'],
  'Custom management software (ERP / CRM)': ['Under 300,000 DZD', '300,000 – 600,000 DZD', '600,000 – 1,100,000 DZD', '1,100,000 DZD and above'],
  'Web / mobile app': ['Under 600,000 DZD', '600,000 – 1,500,000 DZD', '1,500,000 – 3,000,000 DZD', '3,000,000 DZD and above'],
}

// Shown in place of the goal question ONLY for "Management software" leads —
// team/company size drives the quote there (users, seats, roles). Same 'company' field.
const BUSINESS_SIZE_STEP = {
  question: "How big is your business?",
  field: 'company' as const,
  // FR: ['Solo / Micro (1–5)', 'Petite (6–20)', 'Moyenne (21–50)', 'Grande (50+)']
  options: ['Solo / Micro (1–5)', 'Small (6–20)', 'Mid-size (21–50)', 'Large (50+)'],
}

type Selections = { project: string; company: string; budget: string; timeline: string }
type Contact = { name: string; email: string; phone: string; business: string; message: string }

export default function ContactSection() {
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
  const [backWidth, setBackWidth] = useState(0)

  useLayoutEffect(() => {
    if (backRef.current) setBackWidth(backRef.current.offsetWidth)
  }, [])

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
    if (value !== 'Something else') setTimeout(() => navigate(step + 1), 150)
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
  function validateContact(c: Contact): string {
    const errs: string[] = []
    if (c.name.trim().length < 3) errs.push('your name')
    const email = c.email.trim()
    if (email.length < 8 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.push('a valid email address')
    if (c.phone.trim().length < 8) errs.push('a valid phone number')
    if (errs.length === 0) return ''
    // "a valid email address and a valid phone number" / "..., ... and ..."
    const list =
      errs.length === 1 ? errs[0] : `${errs.slice(0, -1).join(', ')} and ${errs[errs.length - 1]}`
    return `Please enter ${list}.`
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

    // Field names here MUST match leadSchema in src/actions/index.ts.
    // For "Something else", we send the free-text (otherText) as the project.
    const { data, error } = await actions.submitLead({
      project: selections.project === 'Something else' ? otherText : selections.project,
      timeline: selections.timeline,
      company: selections.company,
      budget: selections.budget,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      business: contact.business,
      message: contact.message,
      company_website: honeypot, // honeypot — real users leave this empty
    })

    setSubmitting(false)
    if (error || !data?.ok) {
      // Rate-limit / delivery errors carry a user-safe message we wrote in the
      // action. But Astro's INPUT validation error dumps raw Zod JSON in
      // `error.message` — never show that. Only trust our own ActionError codes;
      // anything else gets a generic line.
      const safe =
        error && 'code' in error &&
        (error.code === 'TOO_MANY_REQUESTS' || error.code === 'INTERNAL_SERVER_ERROR')
          ? error.message
          : 'Please check your details and try again.'
      setError(safe)
      return
    }

    // Lead already reached us (Telegram/email) via the action above. Booking is
    // all that's left — show it IN-PAGE: the sent branch renders an inline
    // cal.com embed (prefilled), so the user never leaves the site. Falls back to
    // the static success screen when PUBLIC_CALCOM_URL is unset (CAL_LINK empty).
    setSent(true)
  }

  // Success state. CALLBACK IS PRIMARY (matches the audience: low digital
  // awareness, WhatsApp/phone converts best) — we lead with the reassurance that
  // we'll reach out. Self-service cal.com booking is demoted to an OPTIONAL
  // express lane below, for the eager few who want to lock a slot now. Booking is
  // never a gate: the lead already reached us via the action before this screen.
  if (sent) {
    return (
      <section id="contact" className="bg-palette-950 px-6 pt-32 pb-24 md:px-12">
        <div className="mx-auto max-w-[1000px]">
          <h2 className="font-reckless font-light italic text-white leading-[1.05]" style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}>
            We'll be in touch<span style={{ color: '#F94500' }}>.</span>
          </h2>
          <p className="mt-5 text-palette-300 text-[15px] max-w-md leading-relaxed">
            Got it — your request is in. We'll reach out by WhatsApp or phone within 24 hours to find a time that works.
          </p>

          {/* Optional express lane — only when cal.com is configured */}
          {CAL_LINK && (
            <div className="mt-16 border-t border-palette-800/60 pt-12">
              <p className="text-[13px] font-medium text-palette-400 tracking-widest uppercase">
                Prefer to lock a time now?
              </p>
              <p className="mt-3 text-palette-300 text-[15px] max-w-md leading-relaxed">
                Skip the wait and grab a slot — your name and email are already filled in.
              </p>
              {showCal ? (
                <div className="mt-8">
                  <CalEmbed name={contact.name} email={contact.email} />
                </div>
              ) : (
                <button
                  onClick={() => setShowCal(true)}
                  className="group mt-7 inline-flex items-center gap-3 rounded-full h-12 pl-6 pr-5 text-[16px] font-normal text-white transition-[background-color] duration-200"
                  style={{ backgroundColor: '#F94500' }}
                >
                  Book a time now
                  <ArrowRight size={20} strokeWidth={1.5} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="bg-palette-950 overflow-x-clip">

      {/* Progress bar + step counter */}
      <div className="px-6 pt-32 md:px-12">
        <div className="mx-auto max-w-[900px]">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-[11px] font-medium text-palette-600 tabular-nums tracking-widest uppercase shrink-0">
              Step {step + 1} of {TOTAL}
            </span>
            <div
              className="flex flex-1 gap-1.5"
              role="progressbar"
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

      <div className="mx-auto max-w-[900px] px-6 pt-16 md:px-12" style={{ paddingBottom: 'clamp(64px, calc(43.49px + 5.128vw), 96px)' }}>

        {/* Animated step content only */}
        <div key={animKey} className={dir === 'fwd' ? 'step-enter-fwd' : 'step-enter-bwd'}>
          {step < 4 ? (
            <ChoiceStep
              config={
                CHOICE_STEPS[step].field === 'budget'
                  ? { ...CHOICE_STEPS[step], options: BUDGET_BY_PROJECT[selections.project] ?? CHOICE_STEPS[step].options }
                  : CHOICE_STEPS[step].field === 'company' && selections.project === 'Custom management software (ERP / CRM)'
                    ? BUSINESS_SIZE_STEP
                    : CHOICE_STEPS[step]
              }
              selected={selections[CHOICE_STEPS[step].field]}
              onPick={(val) => pick(CHOICE_STEPS[step].field, val)}
              otherText={step === 0 ? otherText : undefined}
              onOtherChange={step === 0 ? setOtherText : undefined}
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
                Back
              </button>
            </div>
            <button
              onClick={() => navigate(step + 1)}
              disabled={!selections[CHOICE_STEPS[step].field] || (selections[CHOICE_STEPS[step].field] === 'Something else' && !otherText.trim())}
              className="group flex items-center gap-3 rounded-full h-12 pl-6 pr-5 text-[16px] font-normal transition-[background-color,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ backgroundColor: selections[CHOICE_STEPS[step].field] ? '#F94500' : '#262626', color: '#fff' }}
            >
              Continue
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
function CalEmbed({ name, email }: { name: string; email: string }) {
  useEffect(() => {
    let active = true
    ;(async () => {
      const cal = await getCalApi()
      if (!active) return
      cal('ui', {
        theme: 'dark',
        cssVarsPerTheme: { dark: { 'cal-brand': '#F94500' } },
        hideEventTypeDetails: false,
        layout: 'month_view',
      })
    })()
    return () => { active = false }
  }, [])

  return (
    <Cal
      calLink={CAL_LINK}
      style={{ width: '100%', height: '100%', minHeight: '640px', overflow: 'scroll' }}
      config={{ name, email, theme: 'dark', layout: 'month_view' }}
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
  config, selected, onPick, otherText, onOtherChange,
}: {
  config: typeof CHOICE_STEPS[number]
  selected: string
  onPick: (val: string) => void
  otherText?: string
  onOtherChange?: (val: string) => void
}) {
  return (
    <div>
      <h2
        className="font-reckless font-light italic text-white leading-[1.05] mb-10"
        style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}
      >
        {config.question}
      </h2>

      <ol className="divide-y divide-palette-800/60" role="list">
        {config.options.map((option, i) => {
          const isActive = selected === option
          const isSomethingElse = option === 'Something else'
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
                    placeholder="Tell us briefly what you need"
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
  contact, onChange, onSubmit, canSubmit, submitting, error, honeypot, onHoneypotChange, onBack,
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
}) {
  return (
    <div>
      <h2
        className="font-reckless font-light italic text-white leading-[1.05] mb-10"
        style={{ fontSize: 'clamp(40px, 7vw, 80px)' }}
      >
        {"Almost\nthere."}
      </h2>

      <form onSubmit={onSubmit} className="flex flex-col">
        {/* Honeypot — hidden from humans, bots tend to fill it. Server rejects if non-empty. */}
        <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
          <label>
            Company website
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
          <InputField label="Your name" name="name" type="text" value={contact.name} onChange={onChange} required maxLength={50} placeholder="Full name" className="border-b sm:border-r border-palette-800/60 pr-0 sm:pr-8" />
          <InputField label="Email address" name="email" type="email" value={contact.email} onChange={onChange} required maxLength={50} placeholder="you@company.com" className="border-b border-palette-800/60 pl-0 sm:pl-8" />
          <InputField label="Phone number" name="phone" type="tel" value={contact.phone} onChange={onChange} required maxLength={40} placeholder="+213 ..." className="border-b sm:border-b-0 sm:border-r border-palette-800/60 pr-0 sm:pr-8" />
          <InputField label="Business name" name="business" type="text" value={contact.business} onChange={onChange} maxLength={200} placeholder="Company or brand" className="border-b border-palette-800/60 pl-0 sm:pl-8" />
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
          <p className="text-[14px] max-w-xs leading-relaxed" style={{ color: error ? '#F94500' : undefined }}>
            {error ? error : (
              <span className="text-palette-500">We'll reach out within 24 hours to book your call.</span>
            )}
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBack}
              className="group flex items-center gap-3 rounded-full border border-palette-700 h-12 pl-5 pr-6 text-[16px] font-normal text-palette-300 whitespace-nowrap hover:border-palette-500 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft size={16} strokeWidth={1.5} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
              Back
            </button>
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="group inline-flex shrink-0 items-center gap-3 rounded-full h-12 pl-5 pr-[13px] text-[16px] font-normal transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#F94500', color: '#fff' }}
            >
              {submitting ? 'Sending…' : 'Send message'}
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
    <div className={`py-6 ${className}`}>
      <label className="block text-[13px] font-medium text-palette-400 mb-3 tracking-widest uppercase">
        {label}
      </label>
      <input
        type={type} name={name} value={value} onChange={onChange} required={required}
        maxLength={maxLength}
        placeholder={placeholder ?? label}
        className="w-full bg-transparent text-white text-[15px] font-light placeholder:text-palette-600 focus:outline-none"
      />
    </div>
  )
}
