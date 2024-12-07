import { ProgressChart } from './ProgressChart'
import { ComponentProps, useState } from 'react'
import dayjsGmt7 from '@/utils/dayjs-gmt7'
import { GLOBAL_TARGET_PAGE } from '@/models/activities'

export function ProgressChartStory() {
  return (
    <ul className='grid gap-4 lg:grid-cols-2'>
      {[undefined, 5, 26].map((value, idx) => (
        <Segment numberOfActivities={value} key={idx} />
      ))}
    </ul>
  )
}

function Segment({ numberOfActivities }: { numberOfActivities?: number }) {
  const [date] = useState(() => new Date())
  const [datePeriod, setDatePeriod] = useState<'week' | 'month'>('week')

  const data: ComponentProps<typeof ProgressChart>['activities'] = generateData(
    date,
    datePeriod,
    numberOfActivities
  )

  return (
    <div className='w-[300px] flex flex-col'>
      <ProgressChart
        activities={data}
        onDatePeriodChange={setDatePeriod}
        datePeriod={datePeriod}
      />
    </div>
  )
}

function generateData(
  date: Date,
  datePeriod: 'week' | 'month',
  numberOfActivities = 99
): NonNullable<ComponentProps<typeof ProgressChart>['activities']> {
  let startDatetime = dayjsGmt7(date)
  let numberOfData: number

  if (datePeriod === 'week') {
    startDatetime = startDatetime.startOf('week')
    numberOfData = 7
  } else {
    startDatetime = startDatetime.startOf('month')
    numberOfData = startDatetime.daysInMonth()
  }

  const endDate = startDatetime.day(numberOfData - 1)
  const pageCount = endDate.date() % (numberOfData - 1)

  return Array.from(new Array(numberOfData), (_, idx) => ({
    page_count:
      idx === 0 ? 0 : idx > numberOfActivities ? null : pageCount + idx,
    type: 'Sabaq',
    target_page_count: GLOBAL_TARGET_PAGE,
    created_at: startDatetime.add(idx, 'day').toISOString(),
    student_attendance: idx % 7 === 0 ? 'absent' : 'present',
    end_surah: 'Al-Fatihah',
    end_surah_id: 1,
    end_verse: 1,
    halaqah_name: undefined,
    id: idx,
    notes: '',
    start_surah: 'Al-Fatihah',
    start_surah_id: 1,
    start_verse: 1,
    status: '',
    student_id: undefined,
    student_name: undefined,
    tags: []
  }))
}
