import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://iptv-premium.com',
  compressHTML: true,
  build: {
    format: 'file',
  },
});
