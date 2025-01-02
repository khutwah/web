import {
  AlAdhanPrayerTimingsResponse,
  HIJRI_MONTH_NUMBER_TO_TEXT_RECORD
} from '@/models/api/al-adhan'
import { useEffect, useState } from 'react'
import dayjs from '@/utils/dayjs'
import { cn } from '@/utils/classnames'

interface Props {
  hijriDate: AlAdhanPrayerTimingsResponse['data']['date']['hijri'] | undefined
  isDateClickable?: boolean
}

export function DateHeader({ hijriDate, isDateClickable = false }: Props) {
  const [formattedDate, setFormattedDate] = useState<string>('')

  useEffect(() => {
    // Update the date in the client's timezone.
    setFormattedDate(dayjs().format('D MMMM YYYY'))
  }, [])

  return (
    <div className='flex gap-x-[6.5px] text-khutwah-m-regular text-khutwah-neutral-white'>
      {hijriDate && <HijriDate date={hijriDate} />}

      <label
        className={cn({
          'underline decoration-dashed cursor-pointer': isDateClickable
        })}
      >
        {formattedDate}
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
