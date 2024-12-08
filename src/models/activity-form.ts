import { ActivityFormValues, ActivityType } from './activities'
import surah from '@/data/surah.json'

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

export const SURAH_ITEMS = surah.map((s) => ({
  value: String(s.id),
  label: s.name,
  searchable: s.name_simple
}))

export const DEFAULT_START = {
  [ActivityType.Sabaq]: {
    surah: Number(SURAH_ITEMS[77].value),
    verse: 1
  },
  [ActivityType.Manzil]: null,
  [ActivityType.Sabqi]: null
}
