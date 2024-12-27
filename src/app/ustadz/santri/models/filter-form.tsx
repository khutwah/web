import { CheckpointStatus } from '@/models/checkpoint'

export type FilterFormData = {
  ustadzId: number | null | 'ALL'
  checkpointStatuses: Array<CheckpointStatus>
}
