import colors from './overrides/colors.json'

export const khutwahColors = { ...defaultColors(), ...colors }

function defaultColors() {
  return {
    primary: {
      lightest: '#E6F0FF',
      '40': '#9F5C42'
    },
    warning: {
      '70': '#B75E00',
      '80': '#934500',
      '90': '#7A3400'
    },
    error: {
      error: '#F44336'
    },
    neutral: {
      '10': '#F2F4F6',
      '20': '#D9DDE3',
      '30': '#C8CCD2',
      '40': '#B1B5BA',
      '50': '#8C8F93',
      '60': '#5C5E61',
      '70': '#2E3032',
      '80': '#262829',
      '90': '#151718',
      white: '#FFFFFF'
    },
    // TODO: these are added manually, because the "new design system" can't be parsed yet.
    red: {
      dark: '#701600',
      darker: '#580900',
      base: '#7F270F',
      light: '#AA3424',
      lightest: '#F4DAD9'
    },
    blue: {
      lightest: '#E6F0FF',
      base: '#0065FF',
      dark: '#0052CF',
      darker: '#003FA0',
      darkest: '#002C70'
    },
    snow: {
      base: '#CCCCCC',
      lighter: '#E7E7E7',
      lightest: '#F5F5F5'
    },
    lightgreen: {
      lightest: '#F4F8E6'
    },
    green: {
      base: '#329922',
      dark: '#297C1C',
      darker: '#1F6015',
      darkest: '#16430F'
    },
    grey: {
      base: '#171717',
      light: '#454545',
      lighter: '#747474',
      lightest: '#A2A2A2'
    },
    tamarind: {
      darkest: '#4D3F00',
      dark: '#C48F00',
      base: '#F8AE1A',
      lighter: '#FFE791',
      lightest: '#FFF8D9'
    }
  }
}
