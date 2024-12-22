import type { CheckpointType } from '@/models/lajnah'
import { Checkpoint } from './Checkpoint'

interface CheckpointListProps {
  checkpoints: CheckpointType[]
  onCheckpointClick: (checkpoint: CheckpointType) => void
}

export function CheckpointList({
  checkpoints,
  onCheckpointClick
}: CheckpointListProps) {
  return (
    <div className='relative mt-8'>
      <div className='absolute left-4 top-0 h-full w-px bg-mtmh-tamarind-base' />
      <Checkpoint
        type='start'
        checkpoint={checkpoints[0]}
        onCheckpointClick={onCheckpointClick}
      />
      {checkpoints.length > 1 &&
        checkpoints.map((checkpoint) => (
          <Checkpoint
            key={checkpoint.id}
            type='submitted'
            checkpoint={checkpoint}
            onCheckpointClick={onCheckpointClick}
          />
        ))}
      <Checkpoint
        type='upcoming'
        upcomingIndex={checkpoints.length === 1 ? 1 : checkpoints.length + 1}
        checkpoint={checkpoints[checkpoints.length - 1]}
        onCheckpointClick={onCheckpointClick}
      />
    </div>
  )
}
