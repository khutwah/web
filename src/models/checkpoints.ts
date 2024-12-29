import type { Checkpoint } from '@/utils/supabase/models/checkpoints'

export const CHECKPOINT_STATUS: CheckpointStatus[] = [
  'lajnah-approaching',
  'lajnah-ready',
  'lajnah-exam',
  'lajnah-completed',
  'inactive'
]

export const STATUS_LIST: Array<{ label: string; value: CheckpointStatus }> = [
  { label: 'Sedang Berhalangan', value: 'inactive' },
  {
    label: 'Mendekati Lajnah',
    value: 'lajnah-approaching'
  },
  {
    label: 'Persiapan Lajnah',
    value: 'lajnah-ready'
  },
  {
    label: 'Sedang Lajnah',
    value: 'lajnah-exam'
  },
  {
    label: 'Lajnah Selesai',
    value: 'lajnah-completed'
  }
]

export type CheckpointStatus =
  | 'lajnah-approaching'
  | 'lajnah-ready'
  | 'lajnah-exam'
  | 'lajnah-completed'
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

export const TAG_DURING_LAJNAH = 'Sedang Lajnah'
