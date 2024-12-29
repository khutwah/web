import type { Checkpoint } from '@/utils/supabase/models/checkpoints'

export const CHECKPOINT_STATUS: CheckpointStatus[] = [
  'lajnah-assessment-approaching',
  'lajnah-assessment-ready',
  'lajnah-assessment-ongoing',
  'lajnah-assessment-completed',
  'inactive'
]

export const STATUS_LIST: Array<{ label: string; value: CheckpointStatus }> = [
  { label: 'Sedang Berhalangan', value: 'inactive' },
  {
    label: 'Mendekati Lajnah',
    value: 'lajnah-assessment-approaching'
  },
  {
    label: 'Persiapan Lajnah',
    value: 'lajnah-assessment-ready'
  },
  {
    label: 'Sedang Lajnah',
    value: 'lajnah-assessment-ongoing'
  },
  {
    label: 'Lajnah Selesai',
    value: 'lajnah-assessment-completed'
  }
]

export type CheckpointStatus =
  | 'lajnah-assessment-approaching'
  | 'lajnah-assessment-ready'
  | 'lajnah-assessment-ongoing'
  | 'lajnah-assessment-completed'
  | 'inactive'

export interface InsertPayload {
  status: CheckpointStatus
  page_count_accumulation?: number
  last_activity_id?: number
  student_id: number
  start_date: string
  part_count?: number
  end_date?: string
  notes?: string
}

export interface UpdatePayload {
  status?: CheckpointStatus
  end_date?: string
  notes?: string
}

export interface Filter {
  student_id?: number
  limit?: number
  status?: CheckpointStatus[]
}

export type CheckpointList = NonNullable<
  Awaited<ReturnType<Checkpoint['list']>>['data']
>

export interface FormStateErrors {
  id?: string
  notes?: string
  page_count_accumulation?: string
  last_activity_id?: string
  part_count?: string
  student_id?: string
  start_date?: string
  end_date?: string
}

export type FormState =
  | {
      message?: string
    }
  | undefined
  | {
      success: boolean
    }

export const TAG_LAJNAH_ASSESSMENT_ONGOING = 'Sedang Asesmen Lajnah'
