import { Card, CardHeader, CardTitle, CardContent } from '../Card/Card'
import { BookOpen, MoveRight } from 'lucide-react'
import Link from 'next/link'
import { ActivityTypeKey } from '@/models/activities'
import { ActivityBadge } from '../Badge/ActivityBadge'
import dayjsGmt7 from '@/utils/dayjs-gmt7'
import { StickyNote } from '../icons'

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
  surahStart: SurahSubmissionInfo
  surahEnd: SurahSubmissionInfo
  studentName?: string
  halaqahName?: string
  labels?: string[]
}

export function ActivityCard({
  id,
  surahEnd,
  surahStart,
  timestamp,
  notes,
  type,
  isStudentPresent,
  studentName,
  halaqahName,
  labels
}: Props) {
  const date = new Date(timestamp)

  return (
    <Link href={`/activities/${id}`}>
      <Card className='w-[360px] bg-mtmh-neutral-10 text-mtmh-grey-base'>
        <CardHeader className='rounded-t-xl p-5 pb-3'>
          <CardTitle className='flex justify-between items-start'>
            <div className='flex flex-col gap-y-1'>
              <div className='text-xs text-mtmh-neutral-50'>
                {dayjsGmt7(date).format('dddd, DD MMM YYYY. HH:mm')}
              </div>

              {studentName && (
                <div className='font-semibold'>{studentName}</div>
              )}
            </div>

            <ActivityBadge type={type} isStudentPresent={isStudentPresent} />
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col p-5 pt-0 gap-y-4'>
          {halaqahName && (
            <div className='text-xs text-mtmh-grey-light'>{halaqahName}</div>
          )}

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
      </Card>
    </Link>
  )
}

function Labels({ labels }: { labels: string[] }) {
  return (
    <ul className='flex gap-x-1 text-xs'>
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
