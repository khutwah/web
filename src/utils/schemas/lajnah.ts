/* eslint-disable @typescript-eslint/no-explicit-any */
import { number, object, string } from 'yup'
import { testTimestamp } from '../is-valid-date'
import { LajnahFinalMark, LajnahType } from '@/models/lajnah'

const requiredForCompletingDraftLajnah: [string[], any] = [
  ['parent_lajnah_id', 'end_date'],
  {
    is: (parent_lajnah_id: number, end_date: string) =>
      parent_lajnah_id && end_date,
    then: (schema: any) => schema.required(),
    otherwise: (schema: any) => schema.notRequired()
  }
]

const requiredForInitialLajnah: [string, any] = [
  'parent_lajnah_id',
  {
    is: (parent_lajnah_id: number) => !parent_lajnah_id,
    then: (schema: any) => schema.required(),
    otherwise: (schema: any) => schema.notRequired()
  }
]

const requiredForFinalizeLajnah: [string, any] = [
  'final_mark',
  {
    is: (final_mark: LajnahFinalMark) => Boolean(final_mark),
    then: (schema: any) => schema.required(),
    otherwise: (schema: any) => schema.notRequired()
  }
]

export const lajnahSchema = object({
  student_id: number().integer().min(1).required(),
  session_type: string()
    .oneOf(Object.values(LajnahType))
    .when(...requiredForInitialLajnah),
  session_name: string().when(...requiredForInitialLajnah),
  start_surah: number().integer().required(),
  start_verse: number().integer().required(),
  end_surah: number()
    .integer()
    .when(...requiredForCompletingDraftLajnah),
  end_verse: number()
    .integer()
    .when(...requiredForCompletingDraftLajnah),
  notes: string(),
  low_mistake_count: number()
    .integer()
    .when(...requiredForCompletingDraftLajnah),
  medium_mistake_count: number()
    .integer()
    .when(...requiredForCompletingDraftLajnah),
  high_mistake_count: number()
    .integer()
    .when(...requiredForCompletingDraftLajnah),
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
    .when(...requiredForFinalizeLajnah)
})
