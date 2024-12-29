import { AssessmentCheckpointType } from '@/models/assessments'
import { Circle, MoveRight } from 'lucide-react'
import { cn } from '@/utils/classnames'
import { Badge } from '../Badge/Badge'
import Link from 'next/link'

interface AssessmentCheckpointProps {
  checkpoint: AssessmentCheckpointType
  upcomingIndex?: number
  type: 'started' | 'submitted' | 'upcoming' | 'finished'
}

export function AssessmentCheckpoint({
  checkpoint,
  upcomingIndex,
  type
}: AssessmentCheckpointProps) {
  return (
    <div className='relative mb-8 pl-12 w-full'>
      <Link href=''>
        <Circle
          className={cn(
            `absolute left-4 top-2 h-${type === 'submitted' ? 4 : 6} w-${type === 'submitted' ? 4 : 6} -translate-x-1/2 -translate-y-1/2`,
            {
              'fill-mtmh-tamarind-base stroke-mtmh-tamarind-base':
                type === 'started' ||
                type === 'submitted' ||
                type === 'finished',
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
                {checkpoint.mistakes?.low || 0}
              </div>
              <div className='h-6 w-6 rounded-full flex items-center justify-center text-mtmh-sm-regular text-mtmh-warning-70 border border-mtmh-warning-70'>
                {checkpoint.mistakes?.medium || 0}
              </div>
              <div className='h-6 w-6 rounded-full flex items-center justify-center text-mtmh-sm-regular text-mtmh-warning-70 border border-mtmh-warning-70'>
                {checkpoint.mistakes?.high || 0}
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}
