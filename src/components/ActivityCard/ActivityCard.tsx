import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '../Card/Card'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface SurahSubmissionInfo {
  name: string
  verse: string
}

interface Props {
  id: string
  type: string
  pageAmount: number
  notes: string
  timestamp: string
  surahStart: SurahSubmissionInfo
  surahEnd: SurahSubmissionInfo
}

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  weekday: 'long',
  year: 'numeric',
  month: 'numeric',
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
  pageAmount,
  timestamp,
  notes,
  type
}: Props) {
  const date = new Date(timestamp)

  return (
    <Card className='w-[360px]'>
      <CardHeader className='bg-mtmh-primary-primary text-mtmh-neutral-white rounded-t-xl'>
        <CardTitle className='flex justify-between'>
          <div>{type}</div>

          <div className='font-normal'>
            {dateFormatter.format(date)}{' '}
            {timeFormatter.format(date).replace('.', ':')}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col pt-4 gap-y-4'>
        <Description title='Setoran'>
          <div className='flex justify-between gap-x-[11px]'>
            <div className='flex flex-1'>
              {surahStart.name}: {surahStart.verse}
            </div>
            <div>
              <ChevronRight size={20} />
            </div>
            <div className='flex flex-1'>
              {surahEnd.name}: {surahEnd.verse}
            </div>
          </div>
        </Description>

        <hr className='border border-mtmh-neutral-10' />

        <Description title='Jumlah halaman'>{pageAmount}</Description>

        <hr className='border border-mtmh-neutral-10' />

        <Description title='Catatan'>
          <div className='w-full text-ellipsis line-clamp-1'>
            {notes || '-'}
          </div>
        </Description>
      </CardContent>
      <CardFooter className='flex justify-center py-[10px] pt-[10px] border-t border-t-mtmh-neutral-20'>
        <Link
          href={`/activities/${id}`}
          className='text-mtmh-secondary-secondary text-mtmh-button-medium'
        >
          Baca lebih lanjut
        </Link>
      </CardFooter>
    </Card>
  )
}

function Description({
  title,
  children
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-col gap-y-1'>
      <div className='text-mtmh-title-small text-mtmh-neutral-50'>{title}</div>
      <div className='text-sm'>{children}</div>
    </div>
  )
}
