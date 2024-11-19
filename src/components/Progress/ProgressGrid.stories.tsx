import { ActivityTypeKey } from '@/models/activities'
import { ProgressGrid } from './ProgressGrid'
import { ComponentProps, useState } from 'react'
import { addDays } from 'date-fns'

export function ProgressGridStory() {
  const [manzilJuzMilestone, setManzilJuzMilestone] = useState(5)

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
          htmlFor='manzilJuzMilestone'
          className='block text-sm/6 font-medium text-gray-900'
        >
          Milestone juz saat ini (isi -1 untuk tidak ada milestone)
        </label>
        <div className='mt-2'>
          <input
            id='manzilJuzMilestone'
            type='text'
            className='block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6'
            placeholder='Manzil juz milestone'
            defaultValue={manzilJuzMilestone}
            onBlur={(e) => {
              const value = e.currentTarget.value
              if (isNaN(Number(value))) return

              setManzilJuzMilestone(Number(value))
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
          manzilJuzMilestone={
            manzilJuzMilestone > -1 ? manzilJuzMilestone : undefined
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
  const endDate = addDays(date, 2)
  const pageAmount = endDate.getDate() % 6

  return Array.from(new Array(5), (_, idx) => ({
    page_amount: idx === 0 ? null : pageAmount + idx,
    type,
    created_at: addDays(endDate, -idx).toISOString()
  }))
}
