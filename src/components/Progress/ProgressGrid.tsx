'use client'

import {
  ActivityEntry,
  ActivityTypeKey,
  ActivityStatus
} from '@/models/activities'
import { ActivityBadge } from '../Badge/ActivityBadge'
import { Dispatch, SetStateAction, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import dayjsClientSideLocal from '@/utils/dayjs-client-side-local'
import dayjs, { Dayjs } from '@/utils/dayjs'
import { cn } from '@/utils/classnames'
import {
  ProgressGridStatus,
  ProgressGridStatusProps
} from './ProgressGridStatus'

interface Props {
  activities: Array<Omit<ActivityEntry, 'target_page_count'>> | null
  date: Date
  onChangeDate: Dispatch<SetStateAction<Date>>
  status?: ProgressGridStatusProps['status']
  editable?: ProgressGridStatusProps['editable']
  statusParameter?: ProgressGridStatusProps['parameter']
  className?: string
}

interface GridEntry {
  pageCount: number
  isStudentPresent: boolean
  status: ActivityStatus
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DEFAULT_EMPTY_ARRAY: any[] = []

/**
 * Vanilla `<ProgressGrid>`. Offers activities in the form of grid. Directly used only in Ladle stories.
 */
export function ProgressGrid({
  activities: activitiesProp,
  date,
  onChangeDate,
  status,
  editable,
  statusParameter,
  className
}: Props) {
  const activities = activitiesProp ?? DEFAULT_EMPTY_ARRAY

  const startDate = dayjs(date).day(0)
  const endDate = dayjs(date).day(6)

  const { grid, headers } = getInitialVariables(startDate, endDate)

  const grids: Record<ActivityTypeKey, Record<string, GridEntry>> = {
    Sabaq: grid,
    Sabqi: { ...grid },
    Manzil: { ...grid }
  }
  const gridKeys = Object.keys(grids) as Array<ActivityTypeKey>

  for (const activity of activities) {
    const {
      type: rawType,
      created_at, // WARNING: created_at is in UTC.
      page_count,
      student_attendance,
      status
    } = activity
    const type = rawType as ActivityTypeKey

    // Assumption: if page_count is null, then the student was absent.
    if (!grids[type] || !created_at || page_count === null) continue

    // Keep created_at in UTC, since this is a "use client" component.
    const gridId = getGridIdentifier(dayjs.utc(created_at).toDate())
    grids[type][gridId] = {
      pageCount: page_count,
      isStudentPresent: student_attendance === 'present',
      status
    }
  }

  return (
    <div
      className={cn(
        'w-full flex flex-col border border-mtmh-snow-lighter rounded-lg',
        className
      )}
    >
      <div className='w-full flex flex-col gap-y-3 p-3'>
        <table className='[&>*>*>td]:p-1 [&>*>*>td]:text-center w-full'>
          <thead>
            <tr className='text-mtmh-xs-regular h-[28px]'>
              <td className='text-mtmh-xs-semibold text-mtmh-red-light w-[51px]'>
                {dayjsClientSideLocal(date.toISOString()).format('MMM YY')}
              </td>
              {headers.map((header) => {
                return (
                  <td key={header}>
                    <TableHeaderDate dateString={header} />
                  </td>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {gridKeys.map((activityName) => (
              <tr key={activityName}>
                <td className='text-mtmh-sm-semibold'>{activityName}</td>
                {headers.map((header) => {
                  const headerKey = getGridIdentifier(new Date(header))
                  const { pageCount, isStudentPresent, status } =
                    grids[activityName][headerKey]

                  return (
                    <td key={header}>
                      <ActivityBadge
                        type={activityName}
                        isStudentPresent={isStudentPresent}
                        isDraft={status === ActivityStatus.draft}
                        text={isStudentPresent ? `${pageCount}` : '-'}
                      />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>

        <div className='flex w-full justify-between text-mtmh-sm-semibold text-mtmh-red-light'>
          <button
            className='flex gap-x-2'
            onClick={() =>
              onChangeDate((prevDate) =>
                dayjs(prevDate).add(-5, 'day').toDate()
              )
            }
          >
            <ChevronLeft size={16} />

            <div>Mundur</div>
          </button>

          <button
            className='flex gap-x-2'
            onClick={() =>
              onChangeDate((prevDate) => dayjs(prevDate).add(5, 'day').toDate())
            }
          >
            <div>Maju</div>

            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <ProgressGridStatus
        status={status}
        parameter={statusParameter}
        editable={editable}
      />
    </div>
  )
}

/**
 * `<ProgressGrid>` component wrapped with `useState` for the dates. This is used only in real app, so we don't have to
 * define the states manually.
 */
export function ProgressGridWithState(
  props: Omit<Props, 'date' | 'onChangeDate'>
) {
  const [date, setDate] = useState(new Date())

  return <ProgressGrid {...props} date={date} onChangeDate={setDate} />
}

function TableHeaderDate({ dateString }: { dateString: string }) {
  const dayjsObject = dayjs(dateString)
  const isActive = dayjsObject.isSame(new Date(), 'day')

  return (
    <time
      dateTime={dayjsObject.format('YYYY-MM-DD')}
      className={
        isActive
          ? 'rounded-full w-5 h-5 mx-auto flex items-center justify-center bg-mtmh-red-light text-mtmh-neutral-white'
          : undefined
      }
    >
      {dayjsClientSideLocal(dateString).format('DD')}
    </time>
  )
}

function getInitialVariables(startDate: Dayjs, endDate: Dayjs) {
  const grid: Record<string, GridEntry> = {}
  const headers: string[] = []
  let iterator = startDate

  while (!iterator.isAfter(endDate)) {
    grid[getGridIdentifier(iterator.toDate())] = {
      pageCount: 0,
      isStudentPresent: false,
      status: ActivityStatus.completed
    }
    headers.push(iterator.toISOString())

    iterator = iterator.add(1, 'day')
  }

  return { grid, headers }
}

function getGridIdentifier(date: Date) {
  return dayjsClientSideLocal(date.toISOString()).format('DD MMM')
}
