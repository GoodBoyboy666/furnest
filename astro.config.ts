import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sirv from 'sirv';
import { siteConfig } from './src/config';

const pagefindDevAssets: AstroIntegration = {
  name: 'pagefind-dev-assets',
  hooks: {
    'astro:server:setup': ({ server }) => {
      server.middlewares.use('/pagefind', sirv(fileURLToPath(new URL('./dist/pagefind', import.meta.url)), { dev: true }));
    },
  },
};

export default defineConfig({
  site: siteConfig.site.url,
  integrations: [mdx(), sitemap(), react(), pagefindDevAssets],
  vite: { plugins: [tailwindcss()] },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Atkinson',
      cssVariable: '--font-atkinson',
      fallbacks: ['sans-serif'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/atkinson-regular.woff'],
            weight: 400,
            style: 'normal',
            display: 'swap',
          },
          {
            src: ['./src/assets/fonts/atkinson-bold.woff'],
            weight: 700,
            style: 'normal',
            display: 'swap',
          },
        ],
      },
    },
  ],
});
