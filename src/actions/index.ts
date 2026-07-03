import { defineAction, ActionError } from 'astro:actions'
import { z } from 'astro:schema'
import { ui, type Lang } from '../i18n/ui'

/* ============================================================================
 * LEAD SUBMISSION PIPELINE  —  Arcani Studio contact funnel
 * ============================================================================
 *
 * WHAT THIS IS
 * ------------
 * The server-side endpoint that receives a finished contact-form submission,
 * validates it, blocks spam, and notifies us (email + Telegram). It is an
 * Astro Action, exposed automatically at  POST /_actions/submitLead.
 *
 * Also exposes `submitFooterEmail` (POST /_actions/submitFooterEmail) — the
 * footer's "drop your email" field, a much lower-intent capture (email only).
 * Reuses the exact same four delivery channels via a shared `deliver()` +
 * `NotifyPayload` shape (see below) rather than duplicating the integrations.
 *
 * Called from the client islands in:
 *   src/components/sections/ContactSection.tsx  → submit()  → actions.submitLead(...)
 *   src/components/sections/Footer.astro        → inline script → actions.submitFooterEmail(...)
 *
 *
 * THE BIGGER FUNNEL (the plan this is one piece of)
 * -------------------------------------------------
 * Decided across sessions. Goal: book a 30-min call, optimised for an Algerian
 * audience where WhatsApp + calls convert better than email.
 *
 *   1. Visitor fills the multi-step form (project → timeline → team → budget → contact).
 *   2. Submit → THIS action → we receive the qualified lead (email + Telegram).   ← DONE
 *   3. Lead is sent to cal.com "Event 2" (already-qualified, no questions, just
 *      pick a slot), ideally prefilled with name + email.                          ← NOT DONE
 *   4. If they don't self-book, we follow up on WhatsApp with the cal.com link.    ← NOT DONE
 *
 * Two cal.com event types were planned:
 *   - Event 1 "New intake"      — cold link (nav/footer), asks the questions.
 *   - Event 2 "Qualified call"  — no questions, prefilled, for form-completers.   ← form points here
 *
 *
 * WHAT'S DONE  ✅
 * --------------
 *   - Zod validation + length caps + trim on every field.
 *   - Honeypot spam trap (`company_website`).
 *   - Best-effort per-IP rate limit.
 *   - Resend email delivery   (optional — only if its env vars are set).
 *   - Telegram delivery       (optional — only if its env vars are set).
 *   - Airtable backup log     (optional — best-effort archive of every lead;
 *     a failure here is logged but never blocks or errors the visitor's
 *     submission — it's insurance, not a critical channel like the two above).
 *   - Google Sheets backup log (optional — same best-effort/non-blocking deal
 *     as Airtable; a second independent archive for collaborators who only use
 *     Sheets. Talks to a Google Apps Script Web App, not the official Sheets
 *     API — no OAuth/service-account needed, see .env.example for the script).
 *   - Footer email capture also wired to a real backend (`submitFooterEmail`),
 *     mailto: removed there too — same reasoning as the main form.
 *   - Frontend wired: mailto removed, calls this action, shows sending/error states.
 *
 * WHAT'S MISSING / TODO  🚧  (pick up here in a future session)
 * -------------------------------------------------------------
 *   [ ] cal.com account + the two event types created.
 *   [ ] PUBLIC_CALCOM_URL set, and ContactSection redirect to Event 2 on success
 *       (currently it just shows the "We'll be in touch" screen — see that file).
 *   [ ] WhatsApp follow-up. Until then it's manual: we get the phone via
 *       email/Telegram/Sheets and message them ourselves. Researched a bot
 *       (2026-07-03), deliberately NOT building one yet — decision on hold,
 *       revisit later. Findings, so this doesn't get re-researched from
 *       scratch next time:
 *         - Official WhatsApp Business API (Meta Cloud API, directly or via
 *           a BSP like Twilio/360dialog) is the only ban-safe route. Signup
 *           is free, but requires Meta business verification, and sending
 *           the FIRST message to a lead (they haven't messaged us first) is
 *           a business-initiated template message — Meta bills per-message
 *           for that (~$0.01-0.02, utility category), small but non-zero.
 *         - Botpress (and similar no-code bot builders) sit ON TOP of the
 *           same official API — their own "free tier message count" does
 *           NOT waive Meta's underlying per-message fee. Don't mistake a
 *           platform's free quota for Meta's WhatsApp costs going away.
 *         - Unofficial libraries (Baileys, whatsapp-web.js, Evolution API,
 *           etc.) automate a real WhatsApp Web session via reverse-engineered
 *           protocol — genuinely free, but real ban risk (weeks-long bans
 *           reported), and risk is HIGHEST for exactly our use case: proactive
 *           messages to people who haven't messaged us first. Using a personal
 *           (non-Business) number doesn't reduce this — Meta has no official
 *           API for personal accounts at all, so it's the same unofficial/
 *           reverse-engineered route either way, just risking a number we
 *           might use personally too.
 *         - The one genuinely free + zero-risk option: a manual `wa.me`
 *           click-to-chat link (opens WhatsApp pre-filled, a human clicks
 *           send) — no API, no approval, no bot. Good stepgap if/when we
 *           revisit this.
 *   [ ] Real env values filled (.env). Without them, leads VALIDATE but go
 *       NOWHERE — both channels skip silently. THIS IS THE #1 GOTCHA.
 *   [x] Adapter is @astrojs/vercel — deploys as a Vercel serverless function.
 *       Static-only hosting (e.g. Hostinger shared) will NOT run this action.
 *   [x] Leads persisted to Airtable as a backup archive (best-effort, non-blocking).
 *   [x] Leads also persisted to Google Sheets (same best-effort deal, for
 *       collaborators who only use Sheets).
 *   [ ] Durable rate limiting (Redis) for multi-instance — the in-memory limiter
 *       below resets per serverless instance; a Vercel Firewall rule is the
 *       real backstop today.
 *
 *
 * SECURITY NOTES
 * --------------
 *   - All fields length-capped + trimmed → caps payload size hitting mail/Telegram.
 *   - `company_website` honeypot: invisible to humans, bots fill it → we silently
 *     drop it (return ok so the bot can't tell it was caught).
 *   - Per-IP rate limit is IN-MEMORY: a single Node process shares it, but
 *     serverless / multi-instance does NOT. Treat as a speed bump, not a wall.
 *   - Secrets read from env at call time, never returned to the client.
 *
 * ENV VARS (see .env.example for the copy-paste template + setup steps)
 * --------------------------------------------------------------------
 *   RESEND_API_KEY, RESEND_FROM, LEAD_NOTIFY_EMAIL          → email channel
 *   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID                    → Telegram channel
 *   AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME → Airtable backup log
 *   GOOGLE_SHEETS_WEBHOOK_URL, GOOGLE_SHEETS_SECRET         → Google Sheets backup log
 *   PUBLIC_CALCOM_URL                                       → read by the FRONTEND only
 * ============================================================================ */

// ---- validation schema -----------------------------------------------------
// This is the contract between the form and the server. The SAME field names
// are sent from ContactSection.tsx → submit(). If you rename a field here, you
// MUST rename it there too. Validation runs server-side (cannot be bypassed by
// disabling JS); the client-side `canSubmit` check is just UX.

const leadSchema = z.object({
  // --- Step answers ---
  // Strings (not enums) on purpose: the option labels are being iterated on and
  // a FR translation is planned, so we don't want the server to reject a label
  // change. Capped to keep payloads small. `project` is the only required one
  // (it also carries the free-text value when the user picks "Something else").
  project: z.string().trim().min(3).max(200),
  timeline: z.string().trim().max(200).optional().default(''),
  company: z.string().trim().max(200).optional().default(''),
  budget: z.string().trim().max(200).optional().default(''),

  // --- Contact details ---
  // name + phone are required (phone = WhatsApp follow-up channel, the core of
  // the Algeria-focused funnel). email is required on the CLIENT today, but kept
  // optional here so a future email-less variant doesn't need a server change.
  name: z.string().trim().min(1, 'Name is required').max(120),
  email: z.string().trim().email('Invalid email').max(200).optional().or(z.literal('')),
  phone: z.string().trim().min(4, 'Phone is required').max(40),
  business: z.string().trim().max(200).optional().default(''),
  message: z.string().trim().max(5000).optional().default(''), // currently hidden in the UI

  // Honeypot — must stay empty. Accepted by the schema (so bots don't learn it's
  // a trap from a validation error); the handler silently drops non-empty values.
  company_website: z.string().max(200).optional().default(''),

  // Which site locale the visitor filled the form in — controls the language of
  // the notification we receive (Telegram + email), not the lead's own data.
  lang: z.enum(['en', 'fr']).optional().default('en'),
})

// The footer "drop your email" field — a much lower-intent capture than the
// full wizard (email only, no name/phone/project). Its own schema on purpose:
// leadSchema's phone/name are intentionally required for the qualified funnel,
// which this isn't. Reuses the same delivery channels via buildFooterPayload
// below rather than inventing a fifth notification path.
const footerEmailSchema = z.object({
  email: z.string().trim().email('Invalid email').max(200),
  company_website: z.string().max(200).optional().default(''),
  lang: z.enum(['en', 'fr']).optional().default('en'),
})

// ---- naive rate limiter ----------------------------------------------------
// IN-MEMORY, PER-INSTANCE — does not hold on serverless (Vercel spins fresh
// instances per invocation, so this Map resets constantly). Treat as a speed
// bump against casual bots, not a real wall. Not fixed yet — suggestion only,
// stay open to other approaches if a better one shows up:
//   (A) Vercel Firewall dashboard rule (rate-limit rule on /_actions/submitLead,
//       no code change, configure after the project is deployed) — likely path.
//   (B) Swap this Map for a durable store (e.g. Upstash Redis, free tier) so
//       the count is shared across instances — more setup, host-agnostic.
// Revisit only if real spam shows up; honeypot + Zod caps already blunt most of it.

const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  // Opportunistic cleanup so the map can't grow unbounded.
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t > WINDOW_MS)) hits.delete(k)
  }
  return recent.length > MAX_PER_WINDOW
}

// ---- delivery channels (all optional) ---------------------------------------
// Each channel checks its own env vars and returns early (no-op) if unset. So
// the site runs fine with none configured — leads just go nowhere. Configure
// at least Resend or Telegram before launch. `sendAirtable` below is the
// reference example for adding another channel later: write a `send*` fn,
// add it to the Promise.allSettled array in the handler, and explicitly decide
// whether it's CRITICAL (its failure should surface to the visitor, like
// email/Telegram) or PASSIVE (best-effort archive, logged but swallowed, like
// Airtable) — don't assume every channel is equally critical by default.

type Lead = z.infer<typeof leadSchema>

// What every channel actually needs — decoupled from `Lead` so the footer
// email capture (a much smaller shape) can reuse the exact same send*
// functions instead of a fifth set of API integrations. `fields` always
// carries every Airtable/Sheets column key (empty string, not omitted, for
// whatever a given payload doesn't have) so both callers land in the same
// table/columns with blanks in whatever they didn't collect.
type NotifyPayload = {
  subject: string
  telegramHeader: string
  lines: string[]        // body text for email + Telegram
  fields: Record<string, string>  // Airtable/Sheets row
  replyTo?: string
}

// Notification labels — separate from the site's own `ui` translations (those
// are for visitor-facing copy). Keyed the same way so both stay in sync.
const NOTIFY_LABELS = {
  en: {
    project: 'Project', timeline: 'Timeline', goal: 'Goal', businessSize: 'Business size',
    budget: 'Budget', name: 'Name', phone: 'Phone', email: 'Email', business: 'Business',
    newLead: '🆕 New lead', subject: (name: string, project: string) => `New lead — ${name} (${project})`,
    footerHeader: '📧 New footer signup', footerSubject: (email: string) => `New footer signup — ${email}`,
  },
  fr: {
    project: 'Projet', timeline: 'Délai', goal: 'Objectif', businessSize: "Taille de l'entreprise",
    budget: 'Budget', name: 'Nom', phone: 'Téléphone', email: 'Email', business: 'Entreprise',
    newLead: '🆕 Nouveau lead', subject: (name: string, project: string) => `Nouveau lead — ${name} (${project})`,
    footerHeader: '📧 Nouvelle inscription (footer)', footerSubject: (email: string) => `Nouvelle inscription — ${email}`,
  },
} as const

// The `company` field is reused by the form: it holds business size for
// "Management software" leads, otherwise the main goal. Compared against the
// SAME locale's managementKey — lead.project is whatever language the visitor
// submitted in, so comparing against a hardcoded English string would silently
// mislabel every FR "Management software" lead.
function isManagementLead(lead: Lead): boolean {
  return lead.project === ui[lead.lang].contact.managementKey
}

function buildLeadPayload(lead: Lead): NotifyPayload {
  const l = NOTIFY_LABELS[lead.lang]
  const isManagement = isManagementLead(lead)
  return {
    subject: l.subject(lead.name, lead.project),
    telegramHeader: l.newLead,
    replyTo: lead.email || undefined,
    lines: [
      `${l.project}: ${lead.project}`,
      `${l.timeline}: ${lead.timeline || '—'}`,
      `${isManagement ? l.businessSize : l.goal}: ${lead.company || '—'}`,
      `${l.budget}: ${lead.budget || '—'}`,
      '',
      `${l.name}: ${lead.name}`,
      `${l.phone}: ${lead.phone}`,
      `${l.email}: ${lead.email || '—'}`,
      `${l.business}: ${lead.business || '—'}`,
      ...(lead.message ? ['', lead.message] : []),
    ],
    fields: {
      Project: lead.project,
      Timeline: lead.timeline,
      Goal: isManagement ? '' : lead.company,
      'Business size': isManagement ? lead.company : '',
      Budget: lead.budget,
      Name: lead.name,
      Email: lead.email || '',
      Phone: lead.phone,
      Business: lead.business,
      Message: lead.message,
      Lang: lead.lang,
      'Submitted At': new Date().toISOString(),
    },
  }
}

// Footer "drop your email" capture — same table/columns as a full lead
// (per the "same table, labeled row" decision), everything but Email/Lang
// left blank so it's visually obvious which rows are low-intent signups.
function buildFooterPayload(email: string, lang: Lang): NotifyPayload {
  const l = NOTIFY_LABELS[lang]
  return {
    subject: l.footerSubject(email),
    telegramHeader: l.footerHeader,
    replyTo: email,
    lines: [`${l.email}: ${email}`],
    fields: {
      Project: 'Footer signup',
      Timeline: '',
      Goal: '',
      'Business size': '',
      Budget: '',
      Name: '',
      Email: email,
      Phone: '',
      Business: '',
      Message: '',
      Lang: lang,
      'Submitted At': new Date().toISOString(),
    },
  }
}

async function sendEmail(payload: NotifyPayload): Promise<void> {
  const apiKey = import.meta.env.RESEND_API_KEY
  const to = import.meta.env.LEAD_NOTIFY_EMAIL
  const from = import.meta.env.RESEND_FROM // e.g. "Arcani <leads@arcanistudio.com>"
  if (!apiKey || !to || !from) return // not configured → skip silently

  const { Resend } = await import('resend')
  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: payload.replyTo,
    subject: payload.subject,
    text: payload.lines.join('\n'),
  })
  if (error) throw new Error(`Resend: ${error.message}`)
}

async function sendTelegram(payload: NotifyPayload): Promise<void> {
  const token = import.meta.env.TELEGRAM_BOT_TOKEN
  const chatId = import.meta.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return // not configured → skip silently

  // Plain text on purpose — NO parse_mode. User input (name, project, …) is
  // unescaped, so Markdown/HTML parse modes would let a value like "John_Doe"
  // or "*x*" break Telegram's parser (→ 400 → lost lead) or inject formatting.
  const text = [payload.telegramHeader, '', ...payload.lines].join('\n')
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  })
  if (!res.ok) throw new Error(`Telegram: ${res.status} ${await res.text()}`)
}

// PASSIVE channel (see note above) — a best-effort archive, not a critical
// notification path. Runs on every submission (not just as a fallback), so a
// broken token/base is caught the same day rather than sitting silently
// unverified until the day Telegram+email both fail and it's actually needed.
async function sendAirtable(payload: NotifyPayload): Promise<void> {
  const token = import.meta.env.AIRTABLE_API_KEY
  const baseId = import.meta.env.AIRTABLE_BASE_ID
  const table = import.meta.env.AIRTABLE_TABLE_NAME || 'Leads'
  if (!token || !baseId) return // not configured → skip silently

  const res = await fetch(
    `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields: payload.fields }),
    }
  )
  if (!res.ok) throw new Error(`Airtable: ${res.status} ${await res.text()}`)
}

// PASSIVE channel, same reasoning as sendAirtable — a second, independent
// backup archive (some collaborators only use Sheets, not Airtable). Talks to
// a Google Apps Script Web App bound to the target Sheet (doPost appends a
// row) rather than the official Sheets API, so there's no OAuth/service-
// account/JWT-signing to implement — just a webhook URL + a shared secret the
// script checks itself (see .env.example for the script + setup steps).
async function sendGoogleSheets(payload: NotifyPayload): Promise<void> {
  const url = import.meta.env.GOOGLE_SHEETS_WEBHOOK_URL
  const secret = import.meta.env.GOOGLE_SHEETS_SECRET
  if (!url || !secret) return // not configured → skip silently

  const res = await fetch(url, {
    method: 'POST',
    // text/plain, NOT application/json — Apps Script Web Apps with "Anyone"
    // access mishandle a JSON content-type on POST (spuriously returns Drive's
    // "authorization needed" page even though the deployment is genuinely
    // public). The body is still a JSON string; doPost reads it as raw text
    // via e.postData.contents and JSON.parse()s it regardless of the header.
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ secret, fields: payload.fields }),
  })
  if (!res.ok) throw new Error(`Google Sheets: ${res.status} ${await res.text()}`)
}

// ---- action ----------------------------------------------------------------

// Shared by both actions below: rate-limit, fan out to all four channels,
// treat Airtable/Sheets as passive (logged, never thrown), Telegram/email as
// critical (their failure surfaces to the visitor as a generic error).
async function deliver(payload: NotifyPayload, ip: string): Promise<{ ok: true }> {
  if (rateLimited(ip)) {
    throw new ActionError({
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many submissions. Please wait a minute and try again.',
    })
  }

  const [emailResult, telegramResult, airtableResult, sheetsResult] = await Promise.allSettled([
    sendEmail(payload),
    sendTelegram(payload),
    sendAirtable(payload),
    sendGoogleSheets(payload),
  ])

  if (airtableResult.status === 'rejected') {
    console.error('[deliver] Airtable backup failed:', airtableResult.reason)
  }
  if (sheetsResult.status === 'rejected') {
    console.error('[deliver] Google Sheets backup failed:', sheetsResult.reason)
  }

  const criticalFailure = [emailResult, telegramResult].find(
    (r) => r.status === 'rejected'
  ) as PromiseRejectedResult | undefined

  if (criticalFailure) {
    console.error('[deliver] delivery failed:', criticalFailure.reason)
    throw new ActionError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Could not send your request. Please try again or contact us directly.',
    })
  }

  return { ok: true }
}

export const server = {
  submitLead: defineAction({
    accept: 'json',
    input: leadSchema,
    handler: async (lead, ctx) => {
      // Drop bots that filled the honeypot — pretend success, do nothing.
      if (lead.company_website) return { ok: true }
      return deliver(buildLeadPayload(lead), ctx.clientAddress ?? 'unknown')
    },
  }),

  // Footer "drop your email" capture — see footerEmailSchema/buildFooterPayload
  // above. Exposed at POST /_actions/submitFooterEmail.
  submitFooterEmail: defineAction({
    accept: 'json',
    input: footerEmailSchema,
    handler: async (data, ctx) => {
      if (data.company_website) return { ok: true }
      return deliver(buildFooterPayload(data.email, data.lang), ctx.clientAddress ?? 'unknown')
    },
  }),
}
