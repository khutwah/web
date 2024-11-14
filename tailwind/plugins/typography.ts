import plugin from "tailwindcss/plugin"

export const typographyPlugin = plugin(function ({ addUtilities }) {
  addUtilities({
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
