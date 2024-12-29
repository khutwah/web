import { CheckpointStatus } from '@/models/checkpoints'

export type FilterFormData = {
  ustadzId: number | null | 'ALL'
  checkpointStatuses: Array<CheckpointStatus>
}
