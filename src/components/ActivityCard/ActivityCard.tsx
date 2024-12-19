import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '../Card/Card'
import { BookOpen, CircleAlert, MoveRight } from 'lucide-react'
import Link from 'next/link'
import { ActivityStatus, ActivityTypeKey } from '@/models/activities'
import { ActivityBadge } from '../Badge/ActivityBadge'
import { Alert, AlertDescription } from '../Alert/Alert'
import { StickyNote } from '../icons'
import { cn } from '@/utils/classnames'
import dayjs from '@/utils/dayjs'
import { ReadonlyURLSearchParams } from 'next/navigation'

interface SurahSubmissionInfo {
  name: string
  verse: string
}

interface Props {
  id: string
  type: ActivityTypeKey
  isStudentPresent: boolean
  notes: string
  timestamp: string
  tz: string
  status: ActivityStatus
  surahStart?: SurahSubmissionInfo | null
  surahEnd?: SurahSubmissionInfo | null
  studentName?: string
  halaqahName?: string
  labels?: string[]
  queryParams?: ReadonlyURLSearchParams
}

export function ActivityCard({
  id,
  surahEnd,
  surahStart,
  timestamp, // WARNING: timestamp is in UTC.
  tz,
  notes,
  type,
  isStudentPresent,
  studentName,
  halaqahName,
  labels,
  status,
  queryParams
}: Props) {
  let params = null
  if (queryParams) {
    params = new URLSearchParams(queryParams)
    params.set('activity', id)
  }

  return (
    <Link
      href={{
        pathname: '',
        query: params ? params.toString() : { activity: id }
      }}
    >
      <Card className='w-full bg-mtmh-neutral-10 text-mtmh-grey-base relative h-full flex flex-col'>
        <CardHeader className='rounded-t-xl p-5 pb-3'>
          <CardTitle className='flex justify-between items-start'>
            <div className='flex flex-col gap-y-1'>
              <div className='text-xs text-mtmh-neutral-50'>
                {dayjs.utc(timestamp).tz(tz).format('DD MMM YYYY HH:mm')}
              </div>
              {studentName && (
                <div className='font-semibold'>{studentName}</div>
              )}
            </div>

            <ActivityBadge
              type={type}
              isStudentPresent={isStudentPresent}
              isDraft={status === ActivityStatus.draft}
            />
          </CardTitle>
        </CardHeader>
        <CardContent
          className={cn('flex flex-col gap-y-4', {
            'pb-8': status === ActivityStatus.draft
          })}
        >
          {halaqahName && (
            <div className='text-xs text-mtmh-grey-light'>{halaqahName}</div>
          )}

          {surahStart && surahEnd ? (
            <div className='flex items-center gap-x-2 text-sm'>
              <div className='pt-1'>
                <BookOpen className='text-mtmh-grey-lightest' size={16} />
              </div>

              <div className='flex items-center gap-x-2'>
                <div>
                  {surahStart.name}: {surahStart.verse}
                </div>

                <div>
                  <MoveRight size={16} />
                </div>

                <div>
                  {surahEnd.name}: {surahEnd.verse}
                </div>
              </div>
            </div>
          ) : null}

          <div className='flex items-start gap-x-2 text-sm'>
            <div className='pt-1'>
              <StickyNote className='fill-mtmh-grey-lightest' />
            </div>

            <div className='w-full text-ellipsis line-clamp-2'>
              {notes || '-'}
            </div>
          </div>

          {labels && <Labels labels={labels} />}
        </CardContent>
        {status === ActivityStatus.draft && (
          <CardFooter>
            <Alert variant='warning'>
              <CircleAlert aria-hidden size={16} />
              <AlertDescription>
                Aktivitas {type} ini perlu dilengkapi.
              </AlertDescription>
            </Alert>
          </CardFooter>
        )}
      </Card>
    </Link>
  )
}

export function Labels({ labels }: { labels: string[] }) {
  return (
    <ul className='flex gap-1 text-xs flex-wrap'>
      {labels.map((tag, index) => (
        <li
          key={`${tag}-${index}`}
          className='py-0.5 px-2 rounded-lg border border-mtmh-snow-lighter'
        >
          {tag}
        </li>
      ))}
    </ul>
  )
}
