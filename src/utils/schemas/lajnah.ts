/* eslint-disable @typescript-eslint/no-explicit-any */
import { number, object, string } from 'yup'
import { testTimestamp } from '../is-valid-date'
import { LajnahFinalMark, LajnahType } from '@/models/lajnah'

const surahRangeSchema = string()
  .test(
    'is-valid-surah-range',
    'The surah_range must be a valid JSON string of [["start:verse", "end:verse"], ...]',
    (value) => {
      try {
        // Try to parse the string as JSON
        const parsed = JSON.parse(value ?? '')

        // Ensure it's an array of arrays
        if (!Array.isArray(parsed)) return false

        // Validate each sub-array
        return parsed.every(
          (subArray) =>
            Array.isArray(subArray) &&
            subArray.length >= 1 &&
            subArray.length <= 2 &&
            subArray.every((item) => /^\d+:\d+$/.test(item)) // Match "surah:verse" format
        )
      } catch {
        // If parsing fails, return false
        return false
      }
    }
  )
  .required('surah_range is required')

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
  surah_range: surahRangeSchema,
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
