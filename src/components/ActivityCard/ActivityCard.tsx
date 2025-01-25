import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '../Card/Card'
import {
  BookOpen as ActivityRecord,
  File as Notes,
  MoveRight,
  CircleAlert
} from 'lucide-react'
import Link from 'next/link'
import { ActivityStatus, ActivityTypeKey } from '@/models/activities'
import { ActivityBadge } from '../Badge/ActivityBadge'
import { Alert, AlertDescription } from '../Alert/Alert'
import { cn } from '@/utils/classnames'
import dayjs from '@/utils/dayjs'
import { convertSearchParamsToStringRecords } from '@/utils/url'

interface SurahSubmissionInfo {
  name?: string
  verse?: number
}

export interface ActivityCardProps {
  id: string
  type: ActivityTypeKey
  attendance: 'present' | 'absent'
  notes: string
  timestamp: string
  tz: string
  status: ActivityStatus
  surahStart?: SurahSubmissionInfo | null
  surahEnd?: SurahSubmissionInfo | null
  studentName?: string
  halaqahName?: string
  labels?: string[]
  searchParams?: { [key: string]: string | string[] | undefined }
}

export function ActivityCard({
  id,
  surahEnd,
  surahStart,
  timestamp, // WARNING: timestamp is in UTC.
  tz,
  notes,
  type,
  attendance,
  studentName,
  halaqahName,
  labels,
  status,
  searchParams
}: ActivityCardProps) {
  let query = ''
  if (searchParams) {
    const params = new URLSearchParams(
      convertSearchParamsToStringRecords(searchParams)
    )
    params.set('activity', id)
    query = params.toString()
  }

  return (
    <Link
      href={{
        pathname: '',
        query
      }}
    >
      <Card className='w-full bg-khutwah-neutral-10 text-khutwah-grey-base relative h-full flex flex-col'>
        <CardHeader className='rounded-t-xl p-5 pb-2'>
          <CardTitle className='flex justify-between items-start'>
            <div className='flex flex-col gap-y-1'>
              <div className='text-xs text-khutwah-neutral-50'>
                {dayjs.utc(timestamp).tz(tz).format('DD MMM YYYY HH:mm')}
              </div>
              {studentName && (
                <div className='text-khutwah-m-semibold'>{studentName}</div>
              )}
            </div>

            <ActivityBadge
              type={type}
              attendance={attendance}
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
            <div className='text-xs text-khutwah-grey-light'>{halaqahName}</div>
          )}

          {surahStart && surahEnd ? (
            <div className='flex items-center gap-x-2 text-sm'>
              <div>
                <ActivityRecord
                  className='text-khutwah-grey-lightest'
                  size={16}
                />
              </div>

              <div className='flex items-center gap-x-2'>
                {surahStart.name && surahStart.verse ? (
                  <>
                    <div>
                      {surahStart.name}: {surahStart.verse}
                    </div>

                    <div>
                      <MoveRight size={16} />
                    </div>
                  </>
                ) : null}

                <div>
                  {surahEnd.name}: {surahEnd.verse}
                </div>
              </div>
            </div>
          ) : null}

          <div className='flex items-start gap-x-2 text-sm'>
            <div className='pt-1'>
              <Notes className='text-khutwah-grey-lightest' size={16} />
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
        {attendance === 'absent' && (
          <CardFooter>
            <Alert variant='warning'>
              <CircleAlert aria-hidden size={16} />
              <AlertDescription>TIdak setoran {type}.</AlertDescription>
            </Alert>
          </CardFooter>
        )}
      </Card>
    </Link>
  )
}

export function Labels({ labels }: { labels: string[] }) {
  return (
    <ul className='flex gap-1 text-khutwah-xs-regular flex-wrap'>
      {labels.map((tag, index) => (
        <li
          key={`${tag}-${index}`}
          className='py-0.5 px-2 rounded-lg border border-khutwah-snow-base'
        >
          {tag}
        </li>
      ))}
    </ul>
  )
}
