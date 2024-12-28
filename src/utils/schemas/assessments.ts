/* eslint-disable @typescript-eslint/no-explicit-any */
import { number, object, string } from 'yup'
import { testTimestamp } from '../is-valid-date'
import { AssessmentFinalMark, AssessmentType } from '@/models/assessments'

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

const requiredForCompletingDraftAssessment: [string[], any] = [
  ['parent_assessment_id', 'end_date'],
  {
    is: (parent_assessment_id: number, end_date: string) =>
      parent_assessment_id && end_date,
    then: (schema: any) => schema.required(),
    otherwise: (schema: any) => schema.notRequired()
  }
]

const requiredForInitialAssessment: [string, any] = [
  'parent_assessment_id',
  {
    is: (parent_assessment_id: number) => !parent_assessment_id,
    then: (schema: any) => schema.required(),
    otherwise: (schema: any) => schema.notRequired()
  }
]

const requiredForFinalizingAssessment: [string, any] = [
  'final_mark',
  {
    is: (final_mark: AssessmentFinalMark) => Boolean(final_mark),
    then: (schema: any) => schema.required(),
    otherwise: (schema: any) => schema.notRequired()
  }
]

export const assessmentSchema = object({
  student_id: number().integer().min(1).required(),
  session_type: string()
    .oneOf(Object.values(AssessmentType))
    .when(...requiredForInitialAssessment),
  session_name: string().when(...requiredForInitialAssessment),
  surah_range: surahRangeSchema,
  notes: string(),
  low_mistake_count: number()
    .integer()
    .when(...requiredForCompletingDraftAssessment),
  medium_mistake_count: number()
    .integer()
    .when(...requiredForCompletingDraftAssessment),
  high_mistake_count: number()
    .integer()
    .when(...requiredForCompletingDraftAssessment),
  parent_assessment_id: number().integer(),
  final_mark: string().oneOf(Object.values(AssessmentFinalMark)),
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
    .when(...requiredForFinalizingAssessment)
})
