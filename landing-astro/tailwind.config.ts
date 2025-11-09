import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#05122D',
        secondary: '#36B1E1',
        light: '#F8F9FB',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        kufi: ['"Noto Kufi Arabic"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;

