import { ProgressChart, ProgressChartPeriod } from './ProgressChart'
import { ComponentProps, useState } from 'react'
import dayjsClientSideLocal from '@/utils/dayjs-client-side-local'
import { GLOBAL_TARGET_PAGE } from '@/models/activities'

export function ProgressChartStory() {
  return (
    <ul className='grid gap-4 lg:grid-cols-2'>
      {[0, 31, 5, 26].map((value, idx) => (
        <Segment numberOfActivities={value} key={idx} />
      ))}
    </ul>
  )
}

function Segment({ numberOfActivities }: { numberOfActivities: number }) {
  const [date] = useState(() => new Date())
  const [datePeriod, setDatePeriod] = useState<ProgressChartPeriod>('week')

  const data: ComponentProps<typeof ProgressChart>['activities'] = generateData(
    date,
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
  numberOfActivities: number
): ComponentProps<typeof ProgressChart>['activities'] {
  const startDatetime = dayjsClientSideLocal(date.toISOString()).startOf(
    'month'
  )

  const endDate = startDatetime.day(numberOfActivities - 1)
  const pageCount = endDate.date() % (numberOfActivities - 1)

  const activities: ComponentProps<typeof ProgressChart>['activities'] = []

  for (let idx = 0; idx < 31; idx++) {
    activities.push({
      page_count:
        idx === 0 ? 0 : idx > numberOfActivities ? null : pageCount + idx,
      target_page_count: GLOBAL_TARGET_PAGE * (idx + 1),
      created_at: startDatetime.add(idx, 'day').toISOString(),
      student_attendance: idx % 7 === 0 ? 'absent' : 'present',
      id: idx
    })
  }

  return activities
}
