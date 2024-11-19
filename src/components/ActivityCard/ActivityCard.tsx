import { Card, CardHeader, CardTitle, CardContent } from '../Card/Card'
import { BookOpen, MoveRight } from 'lucide-react'
import Link from 'next/link'
import { ActivityType } from '@/models/activities'
import { ActivityBadge } from '../Badge/ActivityBadge'

interface SurahSubmissionInfo {
  name: string
  verse: string
}

interface Props {
  id: string
  type: ActivityType
  isStudentPresent: boolean
  notes: string
  timestamp: string
  surahStart: SurahSubmissionInfo
  surahEnd: SurahSubmissionInfo
  studentName?: string
  halaqahName?: string
  labels?: string[]
}

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  weekday: 'long',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'Asia/Jakarta'
})
const timeFormatter = new Intl.DateTimeFormat('id-ID', {
  hour: 'numeric',
  minute: 'numeric',
  timeZone: 'Asia/Jakarta'
})

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
                {dateFormatter.format(date)}.{' '}
                {timeFormatter.format(date).replace('.', ':')}
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
              <StickyNote className='text-mtmh-grey-lightest' />
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

function StickyNote({ className }: { className: string }) {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        d='M12.6667 2H3.33333C2.598 2 2 2.598 2 3.33333V12.6667C2 13.402 2.598 14 3.33333 14H8.66667C8.75423 14.0001 8.84095 13.9829 8.92184 13.9494C9.00273 13.9159 9.0762 13.8667 9.138 13.8047L13.8047 9.138C13.8595 9.08117 13.9037 9.01502 13.9353 8.94267C13.9447 8.92267 13.95 8.902 13.9573 8.88067C13.9763 8.82488 13.9878 8.76681 13.9913 8.708C13.9927 8.694 14 8.68067 14 8.66667V3.33333C14 2.598 13.402 2 12.6667 2ZM3.33333 3.33333H12.6667V8H8.66667C8.48986 8 8.32029 8.07024 8.19526 8.19526C8.07024 8.32029 8 8.48986 8 8.66667V12.6667H3.33333V3.33333ZM9.33333 11.724V9.33333H11.724L9.33333 11.724Z'
        fill='#A2A2A2'
      />
    </svg>
  )
}
