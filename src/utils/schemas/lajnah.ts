/* eslint-disable @typescript-eslint/no-explicit-any */
import { number, object, string } from 'yup'
import { testTimestamp } from '../is-valid-date'
import { LajnahFinalMark, LajnahType } from '@/models/lajnah'

const requiredWhenParentFilled: [string, any] = [
  'parent_lajnah_id',
  {
    is: (parent_lajnah_id: number) => parent_lajnah_id && parent_lajnah_id > 0,
    then: (schema: any) => schema.required(),
    otherwise: (schema: any) => schema.notRequired()
  }
]

const requiredWhenParentEmpty: [string, any] = [
  'parent_lajnah_id',
  {
    is: (parent_lajnah_id: number) => !parent_lajnah_id,
    then: (schema: any) => schema.required(),
    otherwise: (schema: any) => schema.notRequired()
  }
]

export const createLajnahSchema = object({
  student_id: number().integer().min(1).required(),
  ustadz_id: number().integer().min(1).required(),
  session_type: string()
    .oneOf(Object.values(LajnahType))
    .when(...requiredWhenParentEmpty),
  session_name: string().when(...requiredWhenParentEmpty),
  start_surah: number().integer().required(),
  start_verse: number().integer().required(),
  end_surah: number()
    .integer()
    .when(...requiredWhenParentFilled),
  end_verse: number()
    .integer()
    .when(...requiredWhenParentFilled),
  notes: string(),
  low_mistake_count: number().integer(),
  medium_mistake_count: number().integer(),
  high_mistake_count: number().integer(),
  parent_lajnah_id: number().integer(),
  final_mark: string().oneOf(Object.values(LajnahFinalMark)),
  start_date: string()
    .test(
      'is-valid-date',
      'Tanggal harus dalam format ISO yang valid',
      testTimestamp
    )
    .required(),
  end_date: string()
    .test(
      'is-valid-date',
      'Tanggal harus dalam format ISO yang valid',
      testTimestamp
    )
    .when(...requiredWhenParentFilled)
})
