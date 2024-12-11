import type { Checkpoint } from '@/utils/supabase/models/checkpoint'

export type CheckpointStatus =
  | 'lajnah-approaching'
  | 'lajnah-ready'
  | 'lajnah-exam'
  | 'lajnah-completed'
  | 'inactive'

export interface InsertPayload {
  status: CheckpointStatus
  page_count_accumulation: number
  last_activity_id: number
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
  status?: CheckpointStatus
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
