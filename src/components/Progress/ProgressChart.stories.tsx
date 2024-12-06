import { ActivityEntry, ActivityTypeKey } from '@/models/activities'
import {
  PROGRESS_CHART_DATE_CONTROLS_PORTAL_ID,
  ProgressChart
} from './ProgressChart'
import { ComponentProps, useState } from 'react'
import dayjs from 'dayjs'
import dayjsGmt7 from '@/utils/dayjs-gmt7'

export function ProgressChartStory() {
  const [date] = useState(() => new Date())
  const [datePeriod, setDatePeriod] = useState<'week' | 'month'>('week')

  const data: ComponentProps<typeof ProgressChart>['activities'] = generateData(
    'Sabaq',
    date,
    datePeriod
  )

  const [portalRef, setPortalRef] = useState<HTMLDivElement | null>(null)

  console.info(data)

  return (
    <div className='w-[300px] flex flex-col'>
      <div
        id={PROGRESS_CHART_DATE_CONTROLS_PORTAL_ID}
        ref={setPortalRef}
        className='w-full'
      />

      {/* Force the div to render first, then the chart. This is only needed for client-side rendering (Ladle, in this case). */}
      {portalRef && (
        <ProgressChart
          activities={data}
          onDatePeriodChange={setDatePeriod}
          datePeriod={datePeriod}
        />
      )}
    </div>
  )
}

function generateData(
  type: ActivityTypeKey,
  date: Date,
  datePeriod: 'week' | 'month'
): NonNullable<ComponentProps<typeof ProgressChart>['activities']> {
  let startDatetime = dayjsGmt7(date)
  let numberOfData: number

  if (datePeriod === 'week') {
    numberOfData = 7
  } else {
    startDatetime = startDatetime.startOf('month')
    numberOfData = startDatetime.daysInMonth()
  }

  const endDate = startDatetime.day(numberOfData - 1)
  const pageCount = endDate.date() % (numberOfData - 1)

  return Array.from(new Array(numberOfData), (_, idx) => ({
    page_count: idx === 0 ? 0 : pageCount + idx,
    type,
    created_at: startDatetime.add(idx, 'day').toISOString(),
    student_attendance: idx === 0 ? 'absent' : 'present',
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
