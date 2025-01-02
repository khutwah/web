import type { Config } from 'tailwindcss'
import { typographyPlugin } from './tailwind/plugins/typography'
import { khutwahColors } from './tailwind/colors'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      boxShadow: {
        'flat-top': '0px 1px 0px 0px #E7E7E7 inset'
      },
      colors: {
        khutwah: khutwahColors
      }
    }
  },
  plugins: [typographyPlugin, require('tailwindcss-animate')]
}
export default config
