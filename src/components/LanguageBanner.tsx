import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import type { Lang } from '../i18n/ui'
import { useTranslations, localizePath } from '../i18n/utils'

/**
 * Suggests the other language when the visitor's browser locale doesn't match
 * the page they landed on (e.g. browser set to French, visitor is on the
 * English page). Never auto-redirects — Google advises against that because
 * it can hide pages from crawlers and trap users in the wrong version. This
 * only ever offers a switch; the visitor always sees the page they opened.
 */

// sessionStorage (NOT localStorage) on purpose. Dismissing should stay quiet
// for the rest of THIS tab/window, but a brand new window should ask again.
// localStorage would remember the dismissal forever on that device — one
// accidental or curious click and that visitor could never see the offer
// again, even months later. sessionStorage clears itself per tab, so a
// single click can't permanently opt someone out.
const STORAGE_KEY = 'arcani-lang-banner-dismissed'

// Browser can report several languages in preference order (navigator.languages),
// falling back to the single navigator.language on older browsers. Only fr/en
// matter here (the site's only two locales) — first match wins. Anything else
// (e.g. "de-DE" with no fr/en anywhere in the list) returns null, so the banner
// simply never shows for that visitor rather than guessing.
function detectPreferredLang(): Lang | null {
  const candidates = navigator.languages?.length ? navigator.languages : [navigator.language]
  for (const raw of candidates) {
    const l = raw.toLowerCase()
    if (l.startsWith('fr')) return 'fr'
    if (l.startsWith('en')) return 'en'
  }
  return null
}

export default function LanguageBanner({ lang }: { lang: Lang }) {
  const [visible, setVisible] = useState(false)

  // Client-only check, after mount — navigator/sessionStorage don't exist
  // during Astro's server render, so this has to live in an effect rather
  // than the render body (avoids a server/client hydration mismatch). Starts
  // hidden either way, so there's no flash-of-banner before we know if it
  // should show.
  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return
    const preferred = detectPreferredLang()
    if (preferred && preferred !== lang) setVisible(true)
  }, [lang])

  if (!visible) return null

  const otherLang: Lang = lang === 'en' ? 'fr' : 'en'
  const t = useTranslations(lang).langBanner
  const href = localizePath('/', otherLang)

  // Shared by both exits below (the switch-language link and the ✕). Either
  // way the visitor made a choice, so either way we stop asking — see the
  // sessionStorage note near STORAGE_KEY above for exactly how long that
  // "stop asking" lasts (this tab/window only, not forever).
  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 mx-auto flex w-[calc(100%-2rem)] max-w-md items-center justify-between gap-3 rounded-xl bg-palette-950 px-4 py-3 text-sm text-white shadow-lg">
      <span>{t.message}</span>
      <div className="flex shrink-0 items-center gap-3">
        {/* Label is in the TARGET language on purpose (e.g. "Voir en français"
            shown on the English page) so it reads correctly even to a visitor
            who can't read the sentence next to it. */}
        <a
          href={href}
          onClick={dismiss}
          className="rounded-full bg-primary-600 px-3 py-1.5 font-medium whitespace-nowrap text-white"
        >
          {t.switchLabel}
        </a>
        <button onClick={dismiss} aria-label={t.dismiss} className="text-white/60 hover:text-white">
          <X size={16} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  )
}
