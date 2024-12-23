'use client'

import {
  AlAdhanPrayerTimingsResponse,
  HIJRI_MONTH_NUMBER_TO_TEXT_RECORD
} from '@/models/api/al-adhan'
import dayjs from '@/utils/dayjs'
import { cn } from '@/utils/classnames'

interface Props {
  hijriDate: AlAdhanPrayerTimingsResponse['data']['date']['hijri'] | undefined
  isDateClickable?: boolean
}

export function DateHeader({ hijriDate, isDateClickable }: Props) {
  return (
    <div className='flex gap-x-[6.5px] text-mtmh-m-regular text-mtmh-neutral-white'>
      {hijriDate && <HijriDate date={hijriDate} />}

      <label
        className={cn({
          'underline decoration-dashed cursor-pointer': isDateClickable
        })}
      >
        {dayjs().format('D MMMM YYYY')}
      </label>
    </div>
  )
}

function HijriDate({
  date
}: {
  date: NonNullable<AlAdhanPrayerTimingsResponse['data']['date']['hijri']>
}) {
  const monthText = HIJRI_MONTH_NUMBER_TO_TEXT_RECORD[date.month.number]

  return (
    <>
      <div>
        {Number(date.day)} {monthText} {date.year} H
      </div>
      <div>•</div>
    </>
  )
}
