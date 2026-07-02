import { ui, defaultLang, type Lang } from './ui'

export { defaultLang }
export type { Lang }

/**
 * Reads the active locale from a URL. The first path segment is the locale when
 * it matches a configured language (e.g. `/fr/...`); otherwise we fall back to
 * the default (English, which is unprefixed).
 */
export function getLangFromUrl(url: URL): Lang {
  const [, seg] = url.pathname.split('/')
  if (seg in ui) return seg as Lang
  return defaultLang
}

/**
 * Returns the copy bag for a locale. Use the whole `t` object in a component and
 * read the keys you need, e.g. `t.nav.services`.
 */
export function useTranslations(lang: Lang) {
  return ui[lang]
}

/**
 * Prefixes an internal path with the locale when needed. The default locale is
 * unprefixed, so `localizePath('/book', 'en') === '/book'` and
 * `localizePath('/book', 'fr') === '/fr/book'`. Pass `'/'` to get the home href.
 */
export function localizePath(path: string, lang: Lang): string {
  const clean = path === '/' ? '' : path.replace(/^\/+/, '/')
  if (lang === defaultLang) return clean || '/'
  return `/${lang}${clean}`
}

/**
 * Absolute URLs for every locale variant of the current path, for canonical +
 * hreflang tags. `xDefault` points at the unprefixed default-locale (en) URL,
 * since that's what `prefixDefaultLocale: false` serves at `/`.
 */
export function getAlternateUrls(site: URL | undefined, path: string) {
  const base = site ?? new URL('https://REPLACE-ME.arcanistudio.example')
  return {
    en: new URL(localizePath(path, 'en'), base).toString(),
    fr: new URL(localizePath(path, 'fr'), base).toString(),
    xDefault: new URL(localizePath(path, 'en'), base).toString(),
  }
}
