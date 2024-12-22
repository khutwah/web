import plugin from 'tailwindcss/plugin'

export const typographyPlugin = plugin(function ({ addUtilities }) {
  addUtilities({
    '.text-mtmh-display-large': {
      'font-size': '36px',
      'font-weight': '700',
      'line-height': '44px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-mtmh-display-medium': {
      'font-size': '32px',
      'font-weight': '700',
      'line-height': '40px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-mtmh-display-small': {
      'font-size': '28px',
      'font-weight': '600',
      'line-height': '36px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-mtmh-heading-h1': {
      'font-size': '28px',
      'font-weight': '700',
      'line-height': '36px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-mtmh-heading-h2': {
      'font-size': '24px',
      'font-weight': '600',
      'line-height': '32px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-mtmh-heading-h3': {
      'font-size': '20px',
      'font-weight': '500',
      'line-height': '28px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-mtmh-title-large': {
      'font-size': '18px',
      'font-weight': '700',
      'line-height': '24px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-mtmh-title-medium': {
      'font-size': '16px',
      'font-weight': '600',
      'line-height': '24px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-mtmh-title-small': {
      'font-size': '14px',
      'font-weight': '500',
      'line-height': '20px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-mtmh-body-large': {
      'font-size': '20px',
      'font-weight': '400',
      'line-height': '28px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-mtmh-body-medium': {
      'font-size': '16px',
      'font-weight': '400',
      'line-height': '24px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-mtmh-body-small': {
      'font-size': '14px',
      'font-weight': '400',
      'line-height': '20px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-mtmh-button-large': {
      'font-size': '16px',
      'font-weight': '600',
      'line-height': '24px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-mtmh-button-medium': {
      'font-size': '14px',
      'font-weight': '600',
      'line-height': '20px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-mtmh-button-small': {
      'font-size': '12px',
      'font-weight': '600',
      'line-height': '16px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-mtmh-label': {
      'font-size': '12px',
      'font-weight': '500',
      'line-height': '16px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-mtmh-caption': {
      'font-size': '12px',
      'font-weight': '400',
      'line-height': '16px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    // TODO(imballinst): these are also manually added.
    '.text-mtmh-xl-semibold': {
      'font-size': '24px',
      'font-weight': '600',
      'line-height': '32px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-mtmh-l-semibold': {
      'font-size': '16px',
      'font-weight': '600',
      'line-height': '24px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-mtmh-m-semibold': {
      'font-size': '14px',
      'font-weight': '600',
      'line-height': '20px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-mtmh-m-regular': {
      'font-size': '14px',
      'font-weight': '400',
      'line-height': '20px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-mtmh-sm-semibold': {
      'font-size': '12px',
      'font-weight': '600',
      'line-height': '16px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-mtmh-sm-regular': {
      'font-size': '12px',
      'font-weight': '400',
      'line-height': '16px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-mtmh-xs-semibold': {
      'font-size': '11px',
      'font-weight': '600',
      'line-height': '16px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    },
    '.text-mtmh-xs-regular': {
      'font-size': '11px',
      'font-weight': '400',
      'line-height': '16px',
      'text-align': 'left',
      'text-underline-position': 'from-font',
      'text-decoration-skip-ink': 'none'
    }
  })
})
