import { Card, CardHeader, CardTitle, CardContent } from '../Card/Card'
import {
  BookOpen as ActivityRecord,
  File as Notes,
  MoveRight
} from 'lucide-react'
import Link from 'next/link'
import { ActivityStatus } from '@/models/activities'
import { ActivityBadge } from '../Badge/ActivityBadge'
import dayjs from '@/utils/dayjs'
import { cn } from '@/utils/classnames'
import { ActivityCardProps, Labels } from './ActivityCard'

export function ActivityBriefCard({
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
  const params = new URLSearchParams(searchParams)
  params.set('activity', id)

  return (
    <Link
      href={{
        pathname: '',
        query: params.toString()
      }}
    >
      <Card className='w-full bg-khutwah-neutral-10 text-khutwah-grey-base relative flex flex-col'>
        <CardHeader
          className={cn('rounded-t-xl p-5 pb-2', {
            'pb-1': !studentName
          })}
        >
          <CardTitle className='flex justify-between items-start'>
            <div className='flex flex-col gap-y-1'>
              <div className='text-khutwah-sm-regular text-khutwah-neutral-50'>
                {dayjs.utc(timestamp).tz(tz).format('DD MMM YYYY HH:mm')}
                {halaqahName && <span> • {halaqahName}</span>}
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
        <CardContent className='flex flex-col gap-y-2'>
          {surahStart && surahEnd ? (
            <div
              className={cn(
                'flex items-center gap-x-2 text-khutwah-sm-regular',
                {
                  'text-khutwah-m-regular': !studentName
                }
              )}
            >
              <div>
                <ActivityRecord
                  className='text-khutwah-grey-lightest'
                  size={studentName ? 14 : 16}
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

          {notes && (
            <div
              className={cn(
                'flex items-center gap-x-2 text-khutwah-sm-regular',
                {
                  'text-khutwah-m-regular': !studentName
                }
              )}
            >
              <div>
                <Notes
                  className='text-khutwah-grey-lightest'
                  size={studentName ? 14 : 16}
                />
              </div>

              <div className='w-full text-ellipsis line-clamp-1'>{notes}</div>
            </div>
          )}

          {labels && <Labels labels={labels} />}
        </CardContent>
      </Card>
    </Link>
  )
}
