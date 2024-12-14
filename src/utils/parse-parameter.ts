import { CheckpointList } from '@/models/checkpoint'

export function parseParameter(checkpoint?: CheckpointList[0]) {
  if (!checkpoint) return
  if (checkpoint.status === 'inactive') {
    return checkpoint.notes ?? ''
  }
  return String(checkpoint.part_count)
}
