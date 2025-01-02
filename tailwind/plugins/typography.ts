import plugin from 'tailwindcss/plugin'

export const typographyPlugin = plugin(function ({ addUtilities }) {
  addUtilities({
    '.text-khutwah-display-large': {
      'font-size': '36px',
      'font-weight': '700',
      'line-height': '44px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-khutwah-display-medium': {
      'font-size': '32px',
      'font-weight': '700',
      'line-height': '40px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-khutwah-display-small': {
      'font-size': '28px',
      'font-weight': '600',
      'line-height': '36px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-khutwah-heading-h1': {
      'font-size': '28px',
      'font-weight': '700',
      'line-height': '36px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-khutwah-heading-h2': {
      'font-size': '24px',
      'font-weight': '600',
      'line-height': '32px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-khutwah-heading-h3': {
      'font-size': '20px',
      'font-weight': '500',
      'line-height': '28px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-khutwah-title-large': {
      'font-size': '18px',
      'font-weight': '700',
      'line-height': '24px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-khutwah-title-medium': {
      'font-size': '16px',
      'font-weight': '600',
      'line-height': '24px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-khutwah-title-small': {
      'font-size': '14px',
      'font-weight': '500',
      'line-height': '20px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-khutwah-body-large': {
      'font-size': '20px',
      'font-weight': '400',
      'line-height': '28px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-khutwah-body-medium': {
      'font-size': '16px',
      'font-weight': '400',
      'line-height': '24px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-khutwah-body-small': {
      'font-size': '14px',
      'font-weight': '400',
      'line-height': '20px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-khutwah-button-large': {
      'font-size': '16px',
      'font-weight': '600',
      'line-height': '24px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-khutwah-button-medium': {
      'font-size': '14px',
      'font-weight': '600',
      'line-height': '20px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-khutwah-button-small': {
      'font-size': '12px',
      'font-weight': '600',
      'line-height': '16px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-khutwah-label': {
      'font-size': '12px',
      'font-weight': '500',
      'line-height': '16px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-khutwah-caption': {
      'font-size': '12px',
      'font-weight': '400',
      'line-height': '16px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    // TODO(imballinst): these are also manually added.
    '.text-khutwah-xl-semibold': {
      'font-size': '24px',
      'font-weight': '600',
      'line-height': '32px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-khutwah-l-semibold': {
      'font-size': '16px',
      'font-weight': '600',
      'line-height': '24px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-khutwah-m-semibold': {
      'font-size': '14px',
      'font-weight': '600',
      'line-height': '20px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-khutwah-m-regular': {
      'font-size': '14px',
      'font-weight': '400',
      'line-height': '20px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-khutwah-sm-semibold': {
      'font-size': '12px',
      'font-weight': '600',
      'line-height': '16px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-khutwah-sm-regular': {
      'font-size': '12px',
      'font-weight': '400',
      'line-height': '16px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-khutwah-xs-semibold': {
      'font-size': '11px',
      'font-weight': '600',
      'line-height': '16px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-khutwah-xs-regular': {
      'font-size': '11px',
      'font-weight': '400',
      'line-height': '16px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    }
  })
})
