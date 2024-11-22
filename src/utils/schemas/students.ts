import { object, mixed } from 'yup'
import { parseComaSeparatedNumbers } from '../validation/is-comma-separated-number'

export const studentsFilterSchema = object({
  halaqah_ids: mixed().transform(
    parseComaSeparatedNumbers('Format halaqah_ids harus benar. contoh: 1,2,3')
  )
})
