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

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()]
});