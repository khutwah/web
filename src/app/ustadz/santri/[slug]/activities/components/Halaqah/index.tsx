import { ActivityBadge } from '@/components/Badge/ActivityBadge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/Card/Card'
import { ActivityTypeKey } from '@/models/activities'
import { Bookmark, BookOpen } from 'lucide-react'
import dayjs from '@/utils/dayjs'

interface HalaqahCardProps {
  date: string
  tz: string
  studentName: string
  activityType: ActivityTypeKey
  ustadName: string
  lastSurah?: string
}

function HalaqahCard(props: HalaqahCardProps) {
  const { date, tz, activityType, studentName, ustadName, lastSurah } = props
  return (
    <Card className='w-full bg-mtmh-neutral-10 text-mtmh-grey-base'>
      <CardHeader className='rounded-t-xl p-5 pb-3'>
        <CardTitle className='flex justify-between items-start'>
          <div className='flex flex-col gap-y-1'>
            <div className='text-xs text-mtmh-neutral-50'>
              {dayjs.utc(date).tz(tz).format('DD MMM YYYY HH:mm')}
            </div>
            <div className='font-semibold'>{studentName}</div>
          </div>

          <ActivityBadge type={activityType} isStudentPresent />
        </CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col p-5 pt-0 gap-y-2'>
        <div className='flex items-center gap-x-2 text-sm'>
          <div className='pt-1'>
            <BookOpen className='size-4 text-mtmh-grey-lightest' />
          </div>

          <div className='flex items-center gap-x-2'>
            <div>{ustadName}</div>
          </div>
        </div>

        {lastSurah ? (
          <div className='flex items-start gap-x-2 text-sm'>
            <div className='pt-1'>
              <Bookmark className='size-4 text-mtmh-grey-lightest' />
            </div>

            <div className='w-full text-ellipsis line-clamp-2'>
              {lastSurah || '-'}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

export function Halaqah(props: HalaqahCardProps) {
  return (
    <div className='p-6 bg-mtmh-red-base'>
      <HalaqahCard {...props} />
    </div>
  )
}
