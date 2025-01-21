import { ActivityBadge } from '@/components/Badge/ActivityBadge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/Card/Card'
import { ActivityTypeKey, GLOBAL_TARGET_PAGE_COUNT } from '@/models/activities'
import { Bookmark, BookOpen, Target } from 'lucide-react'
import dayjs from '@/utils/dayjs'
import { TargetPageCount } from '@/components/TargetPageCount/TargetPageCount'

interface HalaqahCardProps {
  date: string
  tz: string
  activityId?: number
  studentId: number
  studentName: string
  activityTargetPageCount?: number | null
  targetPageCount?: number | null
  activityType: ActivityTypeKey
  ustadName: string
  lastSurah?: string
  disallowEditingTargetPageCount?: boolean
  isReview?: boolean
}

function HalaqahCard(props: HalaqahCardProps) {
  const {
    date,
    tz,
    activityType,
    activityId,
    studentId,
    studentName,
    activityTargetPageCount,
    targetPageCount,
    ustadName,
    lastSurah,
    disallowEditingTargetPageCount,
    isReview
  } = props
  return (
    <Card className='w-full bg-khutwah-neutral-white text-khutwah-grey-base'>
      <CardHeader className='rounded-t-xl p-5 pb-3'>
        <CardTitle className='flex justify-between items-start'>
          <div className='flex flex-col gap-y-1'>
            <div className='text-xs text-khutwah-neutral-50'>
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
            <BookOpen className='size-4 text-khutwah-grey-lightest' />
          </div>

          <div className='flex items-center gap-x-2'>
            <div>{ustadName}</div>
          </div>
        </div>

        {lastSurah && (
          <div className='flex items-start gap-x-2 text-sm'>
            <div className='pt-1'>
              <Bookmark className='size-4 text-khutwah-grey-lightest' />
            </div>

            <div className='w-full text-ellipsis line-clamp-2'>
              {lastSurah || '-'}
            </div>
          </div>
        )}

        <div className='flex items-center gap-x-2 text-sm'>
          <div className='pt-1'>
            <Target className='size-4 text-khutwah-grey-lightest' />
          </div>

          <div className='flex items-center gap-x-2'>
            <TargetPageCount
              studentId={studentId}
              activityId={activityId}
              isReview={isReview}
              targetPageCount={
                activityTargetPageCount ??
                targetPageCount ??
                GLOBAL_TARGET_PAGE_COUNT
              }
              editable={!disallowEditingTargetPageCount}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function Halaqah(props: HalaqahCardProps) {
  return (
    <div className='p-6 bg-khutwah-red-base'>
      <HalaqahCard {...props} />
    </div>
  )
}
