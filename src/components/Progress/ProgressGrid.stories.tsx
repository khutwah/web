import { ActivityTypeKey } from '@/models/activities'
import { ProgressGrid } from './ProgressGrid'
import { ComponentProps, useState } from 'react'
import { addDays, setDay } from 'date-fns'

export function ProgressGridStory() {
  const [lajnahJuzMilestone, setlajnahJuzMilestone] = useState(5)

  const [date, setDate] = useState(new Date())
  const data: ComponentProps<typeof ProgressGrid>['activities'] = [
    ...generateData('Sabaq', date),
    ...generateData('Sabqi', date),
    ...generateData('Manzil', date)
  ]

  return (
    <div className='flex flex-col gap-y-8'>
      <div>
        <label
          htmlFor='lajnahJuzMilestone'
          className='block text-sm/6 font-medium text-gray-900'
        >
          Milestone juz saat ini (isi -1 untuk tidak ada milestone)
        </label>
        <div className='mt-2'>
          <input
            id='lajnahJuzMilestone'
            type='text'
            className='block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6'
            placeholder='Manzil juz milestone'
            defaultValue={lajnahJuzMilestone}
            onBlur={(e) => {
              const value = e.currentTarget.value
              if (isNaN(Number(value))) return

              setlajnahJuzMilestone(Number(value))
            }}
          />
        </div>
      </div>

      <hr />

      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8'>
        <ProgressGrid
          activities={data}
          date={date}
          onChangeDate={setDate}
          lajnahJuzMilestone={
            lajnahJuzMilestone > -1 ? lajnahJuzMilestone : undefined
          }
        />
      </div>
    </div>
  )
}

function generateData(
  type: ActivityTypeKey,
  date: Date
): ComponentProps<typeof ProgressGrid>['activities'] {
  const endDate = setDay(date, 5)
  const pageAmount = endDate.getDate() % 6

  return Array.from(new Array(5), (_, idx) => ({
    page_amount: idx === 0 ? null : pageAmount + idx,
    type,
    created_at: addDays(endDate, -idx).toISOString()
  }))
}
