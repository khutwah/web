import type { CheckpointType } from '@/models/assessments'
import { Checkpoint } from './Checkpoint'
import { cn } from '@/utils/classnames'

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
      <div
        className={cn(
          'absolute left-4 top-0 bottom-16 w-px bg-mtmh-tamarind-base',
          {
            'bottom-0': !isFinished
          }
        )}
      />

      <div className='space-y-8'>
        <Checkpoint type='started' checkpoint={checkpoints[0]} />
        {checkpoints.length >= 1 &&
          checkpoints.map((checkpoint) => (
            <Checkpoint
              key={checkpoint.id}
              type={checkpoint.endSurah ? 'submitted' : 'upcoming'}
              upcomingIndex={checkpoints.length}
              checkpoint={checkpoint}
            />
          ))}

        {isFinished && (
          <Checkpoint
            type='finished'
            checkpoint={checkpoints[checkpoints.length - 1]}
          />
        )}
      </div>
    </div>
  )
}
