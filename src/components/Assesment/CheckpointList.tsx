import type { AssessmentCheckpointType } from '@/models/assessments'
import { AssessmentCheckpoint } from './Checkpoint'
import { cn } from '@/utils/classnames'

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
      <div
        className={cn(
          'absolute left-4 top-0 bottom-16 w-px bg-mtmh-tamarind-base',
          {
            'bottom-0': !isFinished
          }
        )}
      />

      <div className='space-y-8'>
        <AssessmentCheckpoint type='started' checkpoint={checkpoints[0]} />
        {checkpoints.length >= 1 &&
          checkpoints
            .filter((_, i) => i > 0)
            .map((checkpoint) => (
              <AssessmentCheckpoint
                key={checkpoint.id}
                type={checkpoint.endSurah ? 'submitted' : 'upcoming'}
                upcomingIndex={checkpoints.length}
                checkpoint={checkpoint}
              />
            ))}

        {isFinished && (
          <AssessmentCheckpoint
            type='finished'
            checkpoint={checkpoints[checkpoints.length - 1]}
          />
        )}
      </div>
    </div>
  )
}
