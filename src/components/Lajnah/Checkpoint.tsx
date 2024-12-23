import { CheckpointType } from '@/models/lajnah'
import { Circle, MoveRight } from 'lucide-react'
import { cn } from '@/utils/classnames'
import { Badge } from '../Badge/Badge'

interface CheckpointProps {
  checkpoint: CheckpointType
  upcomingIndex?: number
  type: 'started' | 'submitted' | 'upcoming' | 'finished'
  onCheckpointClick: (checkpoint: CheckpointType) => void
}

export function Checkpoint({
  checkpoint,
  upcomingIndex,
  type,
  onCheckpointClick
}: CheckpointProps) {
  return (
    <div
      key={checkpoint.id}
      className='relative mb-8 pl-12 w-full cursor-pointer'
      onClick={() => onCheckpointClick(checkpoint)}
    >
      <Circle
        className={cn(
          `absolute left-4 top-2 h-${type === 'submitted' ? 4 : 6} w-${type === 'submitted' ? 4 : 6} -translate-x-1/2 -translate-y-1/2`,
          {
            'fill-mtmh-tamarind-base stroke-mtmh-tamarind-base':
              type === 'started' || type === 'submitted' || type === 'finished',
            'fill-white stroke-mtmh-tamarind-base stroke': type === 'upcoming'
          }
        )}
      />
      <div className='text-left'>
        <div className='text-mtmh-sm-regular text-mtmh-neutral-50'>
          {checkpoint.timestamp}
        </div>
        <div className='mt-1 text-mtmh-l-regular flex items-center gap-1'>
          {type === 'started' && (
            <>
              {checkpoint.startSurah}: {checkpoint.startVerse}
            </>
          )}
          {type === 'finished' && (
            <>
              {checkpoint.endSurah}: {checkpoint.endVerse}
            </>
          )}
          {type === 'submitted' && (
            <>
              {checkpoint.startSurah}: {checkpoint.startVerse}{' '}
              <MoveRight size={16} /> {checkpoint.endSurah}:{' '}
              {checkpoint.endVerse}
            </>
          )}
          {type === 'upcoming' && (
            <>
              {checkpoint[upcomingIndex === 1 ? 'startSurah' : 'endSurah']}:{' '}
              {checkpoint[upcomingIndex === 1 ? 'startVerse' : 'endVerse']}{' '}
              <MoveRight size={16} /> ...
            </>
          )}
        </div>
        {type === 'started' && (
          <div className='mt-2 flex flex-wrap gap-2'>
            <Badge color='tamarind' text='Mulai' />
          </div>
        )}
        {type === 'finished' && (
          <div className='mt-2 flex flex-wrap gap-2'>
            <Badge color='tamarind' text='Selesai' />
          </div>
        )}
        {type === 'upcoming' && (
          <div className='mt-2 flex flex-wrap gap-2'>
            <Badge
              color='tamarind-dashed'
              text={`Checkpoint ${upcomingIndex}`}
            />
          </div>
        )}
        {type == 'submitted' && (
          <div className='mt-2 flex gap-2 text-mtmh-neutral-white'>
            <div className='h-6 w-6 rounded-full flex items-center justify-center text-mtmh-sm-regular text-mtmh-warning-70 border border-mtmh-warning-70'>
              {checkpoint.mistakes?.small || 0}
            </div>
            <div className='h-6 w-6 rounded-full flex items-center justify-center text-mtmh-sm-regular text-mtmh-warning-70 border border-mtmh-warning-70'>
              {checkpoint.mistakes?.medium || 0}
            </div>
            <div className='h-6 w-6 rounded-full flex items-center justify-center text-mtmh-sm-regular text-mtmh-warning-70 border border-mtmh-warning-70'>
              {checkpoint.mistakes?.large || 0}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
