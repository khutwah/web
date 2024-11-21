import { object, string } from 'yup'
import { testTimestamp } from '../is-valid-date'

export const halaqahFilterSchema = object({
  start_date: string().test(
    'is-valid-date',
    'Tanggal harus dalam format ISO yang valid',
    testTimestamp
  ),
  end_date: string().test(
    'is-valid-date',
    'Tanggal harus dalam format ISO yang valid',
    testTimestamp
  )
})
