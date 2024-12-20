import { Card, CardHeader, CardTitle, CardContent } from '../Card/Card'
import {
  BookOpen as ActivityRecord,
  File as Notes,
  MoveRight
} from 'lucide-react'
import Link from 'next/link'
import { ActivityStatus, ActivityTypeKey } from '@/models/activities'
import { ActivityBadge } from '../Badge/ActivityBadge'
import dayjs from '@/utils/dayjs'
import { cn } from '@/utils/classnames'

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
}

export function ActivityBriefCard({
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
  status
}: Props) {
  return (
    <Link href={`?activity=${id}`}>
      <Card className='w-full bg-mtmh-neutral-10 text-mtmh-grey-base relative flex flex-col'>
        <CardHeader
          className={cn('rounded-t-xl p-5 pb-2', {
            'pb-1': !studentName
          })}
        >
          <CardTitle className='flex justify-between items-start'>
            <div className='flex flex-col gap-y-1'>
              <div className='text-mtmh-sm-regular text-mtmh-neutral-50'>
                {dayjs.utc(timestamp).tz(tz).format('DD MMM YYYY HH:mm')}
                {halaqahName && <span> • {halaqahName}</span>}
              </div>
              {studentName && (
                <div className='text-mtmh-m-semibold'>{studentName}</div>
              )}
            </div>

            <ActivityBadge
              type={type}
              isStudentPresent={isStudentPresent}
              isDraft={status === ActivityStatus.draft}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-y-2'>
          {surahStart && surahEnd ? (
            <div
              className={cn('flex items-center gap-x-2 text-mtmh-sm-regular', {
                'text-mtmh-m-regular': !studentName
              })}
            >
              <div>
                <ActivityRecord
                  className='text-mtmh-grey-lightest'
                  size={studentName ? 14 : 16}
                />
              </div>

              <div className='flex items-center gap-x-2'>
                <div>
                  {surahStart.name}: {surahStart.verse}
                </div>

                <div>
                  <MoveRight size={14} />
                </div>

                <div>
                  {surahEnd.name}: {surahEnd.verse}
                </div>
              </div>
            </div>
          ) : null}

          {notes && (
            <div
              className={cn('flex items-center gap-x-2 text-mtmh-sm-regular', {
                'text-mtmh-m-regular': !studentName
              })}
            >
              <div>
                <Notes
                  className='text-mtmh-grey-lightest'
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

export function Labels({ labels }: { labels: string[] }) {
  return (
    <ul className='flex gap-1 text-mtmh-xs-regular flex-wrap'>
      {labels.map((tag, index) => (
        <li
          key={`${tag}-${index}`}
          className='py-0.5 px-2 rounded-lg border border-mtmh-snow-base'
        >
          {tag}
        </li>
      ))}
    </ul>
  )
}
