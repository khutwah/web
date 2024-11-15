import type { Config } from "tailwindcss";
import { typographyPlugin } from "./tailwind/plugins/typography";
import { mtmhColors } from "./tailwind/colors";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mtmh: mtmhColors,
      },
    },
  },
  plugins: [typographyPlugin],
};
export default config;
