'use client'

import {
  ActivityEntry,
  ActivityTypeKey,
  ActivityStatus,
  ACTIVITY_CURRENT_DATE_QUERY_PARAMETER,
  ACTIVITY_CURRENT_DATE_QUERY_PARAMETER_DATE_FORMAT
} from '@/models/activities'
import { ActivityBadge } from '../Badge/ActivityBadge'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import dayjsClientSideLocal from '@/utils/dayjs-client-side-local'
import dayjs, { Dayjs } from '@/utils/dayjs'
import { cn } from '@/utils/classnames'
import {
  ProgressGridStatus,
  ProgressGridStatusProps
} from './ProgressGridStatus'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import { useRouter } from 'next/navigation'
import { extractPathnameAndQueryFromURL } from '@/utils/url'
import { Button } from '../Button/Button'
import { useTransition } from 'react'

interface Props {
  activities: Array<Omit<ActivityEntry, 'target_page_count'>> | null
  date: Date
  onChangeDate: (date: Date) => unknown
  className?: string
  statusProps?: ProgressGridStatusProps
  isLoading?: boolean
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
  className,
  statusProps,
  isLoading
}: Props) {
  const [isTransitioning, startTransition] = useTransition()

  const activities = activitiesProp ?? DEFAULT_EMPTY_ARRAY
  const dateString = date.toISOString()

  const startDate = dayjsClientSideLocal(dateString).startOf('week')
  const endDate = dayjsClientSideLocal(dateString).endOf('week')

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
                      {isLoading ? (
                        <Skeleton className='h-6 mx-auto max-w-10' />
                      ) : (
                        <ActivityBadge
                          hideIcon
                          type={activityName}
                          isStudentPresent={isStudentPresent}
                          isDraft={status === ActivityStatus.draft}
                          text={isStudentPresent ? `${pageCount}` : '-'}
                        />
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>

        <div className='flex w-full justify-between'>
          <Button
            variant='text'
            size='xs'
            className='flex gap-x-2'
            disabled={isLoading || isTransitioning}
            onClick={() => {
              startTransition(() => {
                onChangeDate(dayjs(date).add(-7, 'day').toDate())
              })
            }}
          >
            <ChevronLeft size={16} />

            <div>Mundur</div>
          </Button>

          <Button
            variant='text'
            size='xs'
            className='flex gap-x-2'
            disabled={isLoading || isTransitioning}
            onClick={() => {
              startTransition(() => {
                onChangeDate(dayjs(date).add(7, 'day').toDate())
              })
            }}
          >
            <div>Maju</div>

            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className='w-full h-16 rounded-t-none'></Skeleton>
      ) : (
        <ProgressGridStatus {...statusProps} />
      )}
    </div>
  )
}

/**
 * `<ProgressGrid>` component wrapped with event handlers to update the query parameters whenever the date changes.
 */
export function ProgressGridWithNav(props: Omit<Props, 'onChangeDate'>) {
  const router = useRouter()

  return (
    <ProgressGrid
      {...props}
      onChangeDate={(date) => {
        const currentUrl = new URL(window.location.href)
        currentUrl.searchParams.set(
          ACTIVITY_CURRENT_DATE_QUERY_PARAMETER,
          dayjs(date).format(ACTIVITY_CURRENT_DATE_QUERY_PARAMETER_DATE_FORMAT)
        )

        router.replace(extractPathnameAndQueryFromURL(currentUrl))
      }}
    />
  )
}

export function ProgressGridSkeleton() {
  return (
    <ProgressGrid
      activities={[]}
      date={new Date()}
      onChangeDate={() => {}}
      isLoading
    />
  )
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
