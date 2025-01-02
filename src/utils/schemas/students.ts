import { object, mixed } from 'yup'
import { parseComaSeparatedNumbers } from '../is-comma-separated-number'

export const studentsFilterSchema = object({
  circle_ids: mixed().transform(
    parseComaSeparatedNumbers('Format circle_ids harus benar. contoh: 1,2,3')
  )
})
