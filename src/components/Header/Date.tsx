import {
  AlAdhanPrayerTimingsResponse,
  HIJRI_MONTH_NUMBER_TO_TEXT_RECORD
} from '@/models/api/al-adhan'
import dayjs from 'dayjs'

interface Props {
  hijriDate: AlAdhanPrayerTimingsResponse['data']['date']['hijri'] | undefined
}

export function DateHeader({ hijriDate }: Props) {
  return (
    <div className='flex gap-x-[6.5px] text-mtmh-m-regular text-mtmh-neutral-white'>
      {hijriDate && <HijriDate date={hijriDate} />}

      <div>{dayjs().format('D MMMM YYYY')}</div>
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
