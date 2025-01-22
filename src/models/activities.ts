import { Activities } from '@/utils/supabase/models/activities'

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
  start_surah: number | null
  end_surah: number | null
  start_verse: number | null
  end_verse: number | null
  tags?: string[] | null
  notes?: string | null
  status: ActivityStatus
  is_target_achieved: boolean
  page_count: number | null
  target_page_count: number
  student_attendance: 'present' | 'absent'
  created_at?: string
  type: number
  shift_id: number
  student_id: number
}

export const GLOBAL_TARGET_PAGE_COUNT =
  Number(process.env.NEXT_PUBLIC_GLOBAL_TARGET_PAGE_COUNT) || 2

export const GLOBAL_REVIEW_TARGET_PAGE_COUNT =
  Number(process.env.NEXT_PUBLIC_GLOBAL_REVIEW_TARGET_PAGE_COUNT) || 20

export type ActivityEntry = NonNullable<
  Awaited<ReturnType<Activities['list']>>['data']
>[number]

export type ActivityChartEntry = Awaited<
  ReturnType<Activities['chart']>
>[number]

export type MappedActivityStatus = {
  [key in ActivityTypeKey]?: {
    status: ActivityStatus
    attendance?: 'present' | 'absent'
  }
}

export const ACTIVITY_CURRENT_DATE_QUERY_PARAMETER = 'date'
export const ACTIVITY_PERIOD_QUERY_PARAMETER = 'period'
export const ACTIVITY_VIEW_QUERY_PARAMETER = 'view'
export const ACTIVITY_CONVERT_TO_DRAFT_PARAMETER = 'draft'
export const ACTIVITY_ID_PARAMETER = 'activity'
export const ACTIVITY_CURRENT_DATE_QUERY_PARAMETER_DATE_FORMAT = 'YYYY-MM-DD'
