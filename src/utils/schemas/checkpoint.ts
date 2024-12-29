import { object, string, number } from 'yup'
import { testTimestamp } from '../is-valid-date'
import { CHECKPOINT_STATUS, CheckpointStatus } from '@/models/checkpoints'

export const createCheckpointSchema = object({
  status: string().oneOf(CHECKPOINT_STATUS).required(),
  notes: string().when('status', {
    is: (status: string) => status === 'inactive',
    then: (schema) => schema.min(0).required(),
    otherwise: (schema) => schema.notRequired()
  }),
  page_count_accumulation: number().when('status', {
    is: (status: string) => status !== 'inactive',
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired()
  }),
  last_activity_id: number().when('status', {
    is: (status: string) => status !== 'inactive',
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired()
  }),
  part_count: number().when('status', {
    is: (status: string) => status !== 'inactive',
    then: (schema) => schema.min(0).required(),
    otherwise: (schema) => schema.notRequired()
  }),
  student_id: number().required(),
  start_date: string()
    .test(
      'is-valid-date',
      'Tanggal harus dalam format ISO yang valid',
      testTimestamp
    )
    .required()
})

export const updateCheckpointSchema = object({
  id: number().required(),
  status: string().oneOf(CHECKPOINT_STATUS).required(),
  notes: string().when('status', {
    is: (status: string) => status === 'inactive',
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired()
  }),
  end_date: string()
    .when('status', {
      is: (status: CheckpointStatus) =>
        status === 'lajnah-assessment-completed', // TODO(dio): Add lajnah-assessment-cancelled
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.notRequired()
    })
    .test(
      'is-valid-date',
      'Tanggal harus dalam format ISO yang valid',
      testTimestamp
    ),
  part_count: number().when('status', {
    is: 'inactive',
    then: (schema) => schema.notRequired(),
    otherwise: (schema) => schema.required()
  }),
  page_count_accumulation: number().when('status', {
    is: (status: string) => status !== 'inactive',
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired()
  }),
  last_activity_id: number().when('status', {
    is: (status: string) => status !== 'inactive',
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired()
  })
})
