import type { Config } from "tailwindcss";
import { typographyPlugin } from "./tailwind/plugins/typography";

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
  plugins: [typographyPlugin],
};
export default config;
