import { CheckpointStatus } from '@/models/checkpoints'

export type FilterFormData = {
  ustadzId: number | null | 'ALL'
  role?: number
  checkpointStatuses: Array<CheckpointStatus>
}
