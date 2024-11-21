import { ValidationError } from 'yup'

export const isCommaSeparatedNumbers = (value?: string) => {
  if (!value) return true // Skip validation if the field is empty (use `.required()` for required validation)

  // Regular Expression: Matches only comma-separated numbers
  const regex = /^(\d+)(,\d+)*$/
  return regex.test(value)
}

export const parseComaSeparatedNumbers =
  (message?: string) => (originalValue?: string) => {
    // Parse the comma-separated string into an array of numbers
    if (!originalValue) return

    if (!isCommaSeparatedNumbers(originalValue)) {
      throw new ValidationError(message ?? 'Format harus benar, contoh: 1,2,3')
    }

    return originalValue
      .split(',')
      .map((item) => parseInt(item.trim(), 10)) // Ensure the values are numbers
      .filter((item) => !isNaN(item)) // Remove invalid values (NaN)
  }
