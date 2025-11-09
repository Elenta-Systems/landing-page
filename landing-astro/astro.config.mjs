// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://elenta-systems.netlify.app',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar'],
  },
});
