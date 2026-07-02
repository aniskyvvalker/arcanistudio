import { defineAction, ActionError } from 'astro:actions'
import { z } from 'astro:schema'

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
 * Called from the client island in:
 *   src/components/sections/ContactSection.tsx  → submit()  → actions.submitLead(...)
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
 *   - Frontend wired: mailto removed, calls this action, shows sending/error states.
 *
 * WHAT'S MISSING / TODO  🚧  (pick up here in a future session)
 * -------------------------------------------------------------
 *   [ ] cal.com account + the two event types created.
 *   [ ] PUBLIC_CALCOM_URL set, and ContactSection redirect to Event 2 on success
 *       (currently it just shows the "We'll be in touch" screen — see that file).
 *   [ ] WhatsApp follow-up. User wants to build a bot to send these. Until then
 *       it's manual: we get the phone via email/Telegram and message them.
 *   [ ] Real env values filled (.env). Without them, leads VALIDATE but go
 *       NOWHERE — both channels skip silently. THIS IS THE #1 GOTCHA.
 *   [x] Adapter is @astrojs/vercel — deploys as a Vercel serverless function.
 *       Static-only hosting (e.g. Hostinger shared) will NOT run this action.
 *   [ ] Optional hardening: persist leads (DB / sheet) so none are lost if email
 *       AND Telegram both fail; durable rate limiting (Redis) for multi-instance.
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
 *   RESEND_API_KEY, RESEND_FROM, LEAD_NOTIFY_EMAIL   → email channel
 *   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID             → Telegram channel
 *   PUBLIC_CALCOM_URL                                → read by the FRONTEND only
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

// ---- delivery channels (both optional) -------------------------------------
// Each channel checks its own env vars and returns early (no-op) if unset. So
// the site runs fine with neither configured — leads just go nowhere. Configure
// at least one before launch. To add a channel later (e.g. save to a DB / Google
// Sheet / CRM), write another `send*` fn and add it to the Promise.allSettled
// array in the handler below.

type Lead = z.infer<typeof leadSchema>

function formatLines(lead: Lead): string[] {
  return [
    `Project: ${lead.project}`,
    `Timeline: ${lead.timeline || '—'}`,
    // The `company` field is reused by the form: it holds business size for
    // "Management software" leads, otherwise the main goal. Label accordingly.
    `${lead.project === 'Custom management software (ERP / CRM)' ? 'Business size' : 'Goal'}: ${lead.company || '—'}`,
    `Budget: ${lead.budget || '—'}`,
    '',
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email || '—'}`,
    `Business: ${lead.business || '—'}`,
    ...(lead.message ? ['', lead.message] : []),
  ]
}

async function sendEmail(lead: Lead): Promise<void> {
  const apiKey = import.meta.env.RESEND_API_KEY
  const to = import.meta.env.LEAD_NOTIFY_EMAIL
  const from = import.meta.env.RESEND_FROM // e.g. "Arcani <leads@arcanistudio.com>"
  if (!apiKey || !to || !from) return // not configured → skip silently

  const { Resend } = await import('resend')
  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: lead.email || undefined,
    subject: `New lead — ${lead.name} (${lead.project})`,
    text: formatLines(lead).join('\n'),
  })
  if (error) throw new Error(`Resend: ${error.message}`)
}

async function sendTelegram(lead: Lead): Promise<void> {
  const token = import.meta.env.TELEGRAM_BOT_TOKEN
  const chatId = import.meta.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return // not configured → skip silently

  // Plain text on purpose — NO parse_mode. User input (name, project, …) is
  // unescaped, so Markdown/HTML parse modes would let a value like "John_Doe"
  // or "*x*" break Telegram's parser (→ 400 → lost lead) or inject formatting.
  const text = ['🆕 New lead', '', ...formatLines(lead)].join('\n')
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  })
  if (!res.ok) throw new Error(`Telegram: ${res.status} ${await res.text()}`)
}

// ---- action ----------------------------------------------------------------

export const server = {
  submitLead: defineAction({
    accept: 'json',
    input: leadSchema,
    handler: async (lead, ctx) => {
      // Drop bots that filled the honeypot — pretend success, do nothing.
      if (lead.company_website) return { ok: true }

      const ip = ctx.clientAddress ?? 'unknown'
      if (rateLimited(ip)) {
        throw new ActionError({
          code: 'TOO_MANY_REQUESTS',
          message: 'Too many submissions. Please wait a minute and try again.',
        })
      }

      // Fan out. If a channel is misconfigured we still don't want to lose the
      // lead silently, so surface the first failure — but only after trying both.
      const results = await Promise.allSettled([sendEmail(lead), sendTelegram(lead)])
      const failure = results.find((r) => r.status === 'rejected') as
        | PromiseRejectedResult
        | undefined

      if (failure) {
        console.error('[submitLead] delivery failed:', failure.reason)
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Could not send your request. Please try again or contact us directly.',
        })
      }

      return { ok: true }
    },
  }),
}
