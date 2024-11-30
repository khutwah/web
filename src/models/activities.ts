export enum ActivityType {
  Sabaq = 1,
  Sabqi = 2,
  Manzil = 3
}

export type ActivityTypeKey = keyof typeof ActivityType

export enum ActivityStatus {
  draft = 'draft',
  completed = 'completed',
  deleted = 'deleted'
}

export interface ActivityFormValues {
  start_surah: number
  end_surah: number
  start_verse: number
  end_verse: number
  tags?: string[]
  notes: string
  status: ActivityStatus
  achieve_target: boolean
  page_amount: number
  student_attendance: 'present' | 'absent'
  created_at?: string
  type: number
  shift_id: number
  student_id: number
}

export const GLOBAL_TARGET_PAGE = 4
