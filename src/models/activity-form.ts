import { ActivityFormValues, ActivityType } from './activities'
import surahs from '@/data/mushaf/surahs.json'
import defaultAssessments from '@/data/assessments/ranges/default.json'

export interface FormProps {
  activityId?: number // indicate editing activity
  activityType: ActivityType
  shiftId: number
  studentId: number
  santriPageUri: string
  lastSurah?: number
  lastVerse?: number
  defaultValues?: Partial<
    Omit<
      ActivityFormValues,
      'student_attendance' | 'type' | 'shift_id' | 'student_id'
    >
  > // default value for editing activity
}

export const SURAH_ITEMS = surahs.map((s) => ({
  value: String(s.id),
  label: s.name,
  searchable: s.name_simple
}))

export const PER_ASSESSMENT_JUZ_ITEMS = Array.from({ length: 30 }, (_, i) => ({
  value: String(i + 1),
  label: `Juz ${i + 1}`,
  searchable: String(i + 1)
}))

export const DEFAULT_ASSESSMENT_ITEMS = defaultAssessments.map(
  (assessment) => ({
    value: String(assessment.id),
    label: (() => {
      return assessment.ranges
        .map((range) => `Juz ${range.start.juz} - Juz ${range.end.juz}`)
        .join(' dan ')
    })()
  })
)

export const DEFAULT_START = {
  [ActivityType.Sabaq]: {
    surah: Number(SURAH_ITEMS[77].value),
    verse: 1
  },
  [ActivityType.Manzil]: null,
  [ActivityType.Sabqi]: null
}
