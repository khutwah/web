import { ActivityTypeKey } from '@/models/activities'
import { ProgressGrid } from './ProgressGrid'
import { ProgressGridStatus } from './ProgressGridStatus'
import { ComponentProps, useState } from 'react'
import dayjs from 'dayjs'

export function ProgressGridStory() {
  const [date, setDate] = useState(new Date())
  const data: ComponentProps<typeof ProgressGrid>['activities'] = [
    ...generateData('Sabaq', date),
    ...generateData('Sabqi', date),
    ...generateData('Manzil', date)
  ]

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8'>
      <div>
        <ProgressGrid
          activities={data}
          date={date}
          onChangeDate={setDate}
          statusProps={{
            status: 'lajnah-approaching',
            parameter: '5',
            editable: true
          }}
        />
      </div>

      <div>
        <ProgressGrid
          activities={data}
          date={date}
          onChangeDate={setDate}
          statusProps={{
            status: 'lajnah-exam',
            parameter: '5',
            editable: false
          }}
        />
      </div>

      <div>
        <ProgressGrid activities={data} date={date} onChangeDate={setDate} />
      </div>
    </div>
  )
}

function generateData(
  type: ActivityTypeKey,
  date: Date
): NonNullable<ComponentProps<typeof ProgressGrid>['activities']> {
  const endDate = dayjs(date).day(6)
  const pageAmount = endDate.date() % 6

  return Array.from(new Array(7), (_, idx) => ({
    page_count: idx === 0 ? null : pageAmount + idx,
    type,
    created_at: dayjs(endDate).add(-idx, 'day').toISOString(),
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
    tags: [],
    has_edit_access: false,
    created_by: 1
  }))
}

export function StatusStory() {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8'>
      <ProgressGridStatus />
      <ProgressGridStatus status='inactive' parameter='belum siap' />
      <ProgressGridStatus status='lajnah-approaching' parameter='5' />
      <ProgressGridStatus status='lajnah-ready' parameter='5' />
      <ProgressGridStatus status='lajnah-exam' parameter='5' />
      <ProgressGridStatus status='lajnah-exam' parameter='5' editable={false} />
    </div>
  )
}
