// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import node from '@astrojs/node';

// https://astro.build/config
// Pages stay static (output: 'static'); the Node adapter enables on-demand
// rendering only where needed — i.e. the lead-submission Action endpoint.
export default defineConfig({
  adapter: node({ mode: 'standalone' }),

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

  integrations: [react()]
});