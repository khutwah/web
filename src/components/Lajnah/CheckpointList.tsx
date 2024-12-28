import type { CheckpointType } from '@/models/assessments'
import { Checkpoint } from './Checkpoint'

interface CheckpointListProps {
  checkpoints: CheckpointType[]
  isFinished?: boolean
}

export function CheckpointList({
  checkpoints,
  isFinished
}: CheckpointListProps) {
  return (
    <div className='relative mt-8'>
      <div className='absolute left-4 top-0 bottom-16 w-px bg-mtmh-tamarind-base' />
      <Checkpoint type='started' checkpoint={checkpoints[0]} />
      {checkpoints.length > 1 &&
        checkpoints.map((checkpoint) => (
          <Checkpoint
            key={checkpoint.id}
            type='submitted'
            checkpoint={checkpoint}
          />
        ))}

      {isFinished ? (
        <Checkpoint
          type='finished'
          upcomingIndex={checkpoints.length === 1 ? 1 : checkpoints.length + 1}
          checkpoint={checkpoints[checkpoints.length - 1]}
        />
      ) : (
        <Checkpoint
          type='upcoming'
          upcomingIndex={checkpoints.length === 1 ? 1 : checkpoints.length + 1}
          checkpoint={checkpoints[checkpoints.length - 1]}
        />
      )}
    </div>
  )
}
