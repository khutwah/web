import { object, string, number } from 'yup'
import { testTimestamp } from '../is-valid-date'

export const createCheckpointSchema = object({
  status: string()
    .oneOf([
      'lajnah-approaching',
      'lajnah-ready',
      'lajnah-exam',
      'lajnah-completed',
      'inactive'
    ])
    .required(),
  notes: string(),
  page_count_accumulation: number().min(0).required(),
  last_activity_id: number(),
  part_count: number(),
  student_id: number().required(),
  start_date: string()
    .test(
      'is-valid-date',
      'Tanggal harus dalam format ISO yang valid',
      testTimestamp
    )
    .required(),
  end_date: string().test(
    'is-valid-date',
    'Tanggal harus dalam format ISO yang valid',
    testTimestamp
  )
})

export const updateCheckpointSchema = object({
  status: string()
    .oneOf([
      'lajnah-approaching',
      'lajnah-ready',
      'lajnah-exam',
      'lajnah-completed',
      'inactive'
    ])
    .required(),
  notes: string().when('status', {
    is: 'inacvite',
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired()
  }),
  end_date: string().when('status', {
    is: 'lajnah-completed',
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired()
  }),
  part_count: number()
})
