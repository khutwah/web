/* eslint-disable @typescript-eslint/no-explicit-any */
import { bool, number, object, string } from 'yup'
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
  session_range_id: number()
    .integer()
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
    .when(...requiredForFinalizingAssessment),
  checkpoint_id: number()
    .integer()
    .when(...requiredForInitialAssessment),
  checkpoint_last_activity_id: number()
    .integer()
    .when(...requiredForInitialAssessment),
  checkpoint_status: string()
    .oneOf([
      'lajnah-assessment-ongoing',
      'lajnah-assessment-completed',
      'assessment-ongoing',
      'assessment-completed'
    ])
    .when(...requiredForInitialAssessment),
  checkpoint_page_count_accumulation: number().when(
    ...requiredForInitialAssessment
  ),
  checkpoint_part_count: number()
    .integer()
    .when(...requiredForInitialAssessment),
  is_lajnah_assessment: bool().when(...requiredForInitialAssessment)
})

export const UpdateAssessmentCheckpointSchema = object({
  id: number().required(),
  student_id: number().required(),
  ustadz_id: number().required(),
  parent_assessment_id: number().required(),
  notes: string(),
  start_date: string().required().test(testTimestamp),
  end_date: string().test(testTimestamp),
  start_surah: number().required().min(1),
  start_verse: number().required().min(1),
  end_surah: number().required().min(1),
  end_verse: number().required().min(1),
  // Only sent for the final mark.
  final_mark: string()
})
