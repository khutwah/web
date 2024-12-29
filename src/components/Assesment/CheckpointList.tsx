import type { AssessmentCheckpointType } from '@/models/assessments'
import { AssessmentCheckpoint } from './Checkpoint'

interface AssessmentCheckpointListProps {
  checkpoints: AssessmentCheckpointType[]
  isFinished?: boolean
}

export function AssessmentCheckpointList({
  checkpoints,
  isFinished
}: AssessmentCheckpointListProps) {
  return (
    <div className='relative mt-8'>
      <div className='absolute left-4 top-0 bottom-16 w-px bg-mtmh-tamarind-base' />
      <AssessmentCheckpoint type='started' checkpoint={checkpoints[0]} />
      {checkpoints.length > 1 &&
        checkpoints.map((checkpoint) => (
          <AssessmentCheckpoint
            key={checkpoint.id}
            type='submitted'
            checkpoint={checkpoint}
          />
        ))}

      {isFinished ? (
        <AssessmentCheckpoint
          type='finished'
          upcomingIndex={checkpoints.length === 1 ? 1 : checkpoints.length + 1}
          checkpoint={checkpoints[checkpoints.length - 1]}
        />
      ) : (
        <AssessmentCheckpoint
          type='upcoming'
          upcomingIndex={checkpoints.length === 1 ? 1 : checkpoints.length + 1}
          checkpoint={checkpoints[checkpoints.length - 1]}
        />
      )}
    </div>
  )
}
