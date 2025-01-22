import { AssessmentCheckpointType } from '@/models/assessments'
import { Circle, MoveRight } from 'lucide-react'
import { cn } from '@/utils/classnames'
import { Badge } from '../Badge/Badge'
import { dayjs } from '@/utils/dayjs'
import getTimezoneInfo from '@/utils/get-timezone-info'

interface AssessmentCheckpointProps {
  checkpoint: AssessmentCheckpointType
  upcomingIndex?: number
  type: 'started' | 'submitted' | 'upcoming' | 'finished'
}

export async function AssessmentCheckpoint({
  checkpoint,
  upcomingIndex,
  type
}: AssessmentCheckpointProps) {
  const tz = await getTimezoneInfo()

  return (
    <div className='relative pl-12 w-full'>
      <Circle
        className={cn(
          `absolute left-4 top-2 h-${type === 'submitted' ? 4 : 6} w-${type === 'submitted' ? 4 : 6} -translate-x-1/2 -translate-y-1/2`,
          {
            'fill-khutwah-tamarind-base stroke-khutwah-tamarind-base':
              type === 'started' || type === 'submitted' || type === 'finished',
            'fill-white stroke-khutwah-tamarind-base stroke':
              type === 'upcoming'
          }
        )}
      />
      <div className='text-left'>
        <div className='text-khutwah-sm-regular text-khutwah-neutral-50'>
          {dayjs.utc(checkpoint.timestamp).tz(tz).format('DD MMM YYYY HH:mm')}
        </div>
        <div className='mt-1 text-khutwah-l-regular flex items-center gap-1'>
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
          {(type === 'submitted' || type === 'upcoming') && (
            <>
              {checkpoint.startSurah}: {checkpoint.startVerse}{' '}
              <MoveRight size={16} /> {checkpoint.endSurah}
              {type === 'submitted' && ':'} {checkpoint.endVerse ?? '...'}
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
          <div className='mt-2 flex gap-2 text-khutwah-neutral-white'>
            <div className='h-6 w-6 rounded-full flex items-center justify-center text-khutwah-sm-regular text-khutwah-warning-70 border border-khutwah-warning-70'>
              {checkpoint.mistakes?.low || 0}
            </div>
            <div className='h-6 w-6 rounded-full flex items-center justify-center text-khutwah-sm-regular text-khutwah-warning-70 border border-khutwah-warning-70'>
              {checkpoint.mistakes?.high || 0}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
