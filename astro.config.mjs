// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import sentry from '@sentry/astro';

// https://astro.build/config
// Pages stay static (output: 'static'); the Vercel adapter enables on-demand
// rendering only where needed — i.e. the lead-submission Action endpoint —
// as a Vercel serverless function.
export default defineConfig({
  // Current live domain is the Vercel-assigned one — swap for the real custom
  // domain (or set SITE_URL) once bought. Drives canonical/hreflang/OG URLs
  // and the sitemap's <loc> values.
  site: process.env.SITE_URL ?? 'https://arcanistudio.vercel.app',

  // Canonical/hreflang tags never emit a trailing slash (see i18n/utils.ts
  // localizePath) — match that here so the generated sitemap agrees instead
  // of listing "/fr/" against a canonical of "/fr".
  trailingSlash: 'never',

  adapter: vercel(),

  // English at the root (/), French under /fr. The default locale is not
  // prefixed, so existing English URLs stay unchanged.
  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false,
    },
  },

  // Safety net for anyone typing/linking /en assuming standard i18n URLs —
  // redirect to the real (unprefixed) English root instead of 404ing or
  // serving duplicate content at two URLs.
  redirects: {
    '/en': '/',
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    react(),
    sitemap({ lastmod: new Date() }),
    // Skipped entirely when the DSN is unset, so local dev never reports
    // errors to Sentry. Source map upload also skipped unless an auth token
    // is present, to keep `npm run build` working without Sentry creds.
    ...(process.env.SENTRY_DSN
      ? [
          sentry({
            dsn: process.env.SENTRY_DSN,
            sourceMapsUploadOptions: {
              enabled: Boolean(process.env.SENTRY_AUTH_TOKEN),
              authToken: process.env.SENTRY_AUTH_TOKEN,
              org: process.env.SENTRY_ORG,
              project: process.env.SENTRY_PROJECT,
            },
          }),
        ]
      : []),
  ]
});