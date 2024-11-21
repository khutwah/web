export const testTimestamp = (value?: string) =>
  !value || !isNaN(Date.parse(value))
