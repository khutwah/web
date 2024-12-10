type CheckpointStatus =
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
  end_date?: string | null
  notes?: string
}

export interface UpdatePayload {
  status?: CheckpointStatus
  end_date?: string
  notes?: string
}

export interface Filter {
  student_id?: number
  start_date?: string
  end_date?: string
  limit?: number
  status?: CheckpointStatus
}
