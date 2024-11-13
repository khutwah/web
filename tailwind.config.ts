import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mtmh: {
          primary: {
            primary: '#602515'
          },
          secondary: {
            secondary: '#F8AE1A'
          },
          neutral: {
            10: '#F2F4F6',
            20: '#D9DDE3',
            50: '#8C8F93',
            white: '#ffffff'
          }
        }
      }
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        // TODO: not sure if there's a better way to do this?
        '.text-mtmh-title-small': {
          'font-size': '14px',
          'font-weight': '500',
          'line-height': '20px',
          'text-align': 'left',
          'text-underline-position': 'from-font',
          'text-decoration-skip-ink': 'none',
        },
        '.text-mtmh-button-medium': {
          'font-size': '14px',
          'font-weight': '600',
          'line-height': '20px',
          'text-align': 'left',
          'text-underline-position': 'from-font',
          'text-decoration-skip-ink': 'none',
        },
      })
    })
  ],
};
export default config;
