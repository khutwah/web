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
import { Dayjs } from '@/utils/dayjs'
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
  attendance?: 'present' | 'absent'
  status: ActivityStatus
}

const DEFAULT_EMPTY_ARRAY: NonNullable<Props['activities']> = []

/**
 * Vanilla `<ProgressGrid>`. Offers activities in the form of grid. Directly used only in Ladle stories.
 */
export function ProgressGrid({
  activities: activitiesProp,
  date: currentDate,
  onChangeDate,
  className,
  statusProps,
  isLoading: isLoadingProp
}: Props) {
  const [isTransitioning, startTransition] = useTransition()
  const isLoadingOrTransitioning = isTransitioning || isLoadingProp

  const activities = isTransitioning
    ? DEFAULT_EMPTY_ARRAY
    : (activitiesProp ?? DEFAULT_EMPTY_ARRAY)
  const dateString = currentDate.toISOString()

  const startDate = dayjsClientSideLocal(dateString).startOf('week')
  const endDate = dayjsClientSideLocal(dateString).endOf('week')
  const isCurrentWeek = startDate.isSame(new Date(), 'week')

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

    if (!grids[type] || !created_at) {
      continue
    }

    // Keep created_at in UTC, since this is a "use client" component.
    const gridId = getGridIdentifier(dayjsClientSideLocal(created_at).toDate())
    grids[type][gridId] = {
      pageCount: page_count || 0,
      attendance: student_attendance as 'present' | 'absent',
      status: status as ActivityStatus
    }
  }

  return (
    <div
      className={cn(
        'w-full flex flex-col border border-khutwah-snow-lighter rounded-lg',
        className
      )}
    >
      <div className='w-full flex flex-col gap-y-3 p-3'>
        <table className='[&>*>*>td]:p-1 [&>*>*>td]:text-center w-full table-fixed'>
          <thead>
            <tr className='text-khutwah-xs-regular h-[28px]'>
              <td className='text-khutwah-xs-semibold text-khutwah-red-light w-[51px]'>
                {dayjsClientSideLocal(currentDate.toISOString()).format(
                  'MMM YY'
                )}
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
                <td className='text-khutwah-sm-semibold'>{activityName}</td>
                {headers.map((header) => {
                  const headerKey = getGridIdentifier(new Date(header))
                  const { pageCount, attendance, status } =
                    grids[activityName][headerKey]

                  return (
                    <td key={header}>
                      {isLoadingOrTransitioning ? (
                        <Skeleton className='h-5 mx-auto max-w-10 py-0.5 px-2' />
                      ) : (
                        <ActivityBadge
                          hideIcon
                          type={activityName}
                          attendance={attendance}
                          isDraft={status === ActivityStatus.draft}
                          text={attendance === undefined ? '-' : `${pageCount}`}
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
            variant='text2'
            size='xs'
            className='flex gap-x-2 pr-3'
            disabled={isLoadingOrTransitioning}
            onClick={() => {
              startTransition(() => {
                onChangeDate(
                  dayjsClientSideLocal(currentDate.toISOString())
                    .add(-7, 'day')
                    .toDate()
                )
              })
            }}
          >
            <ChevronLeft size={16} />

            <div>Mundur</div>
          </Button>

          {!isCurrentWeek && (
            <Button
              variant='text2'
              size='xs'
              className='flex gap-x-2 pl-3'
              disabled={isLoadingOrTransitioning}
              onClick={() => {
                startTransition(() => {
                  onChangeDate(
                    dayjsClientSideLocal(currentDate.toISOString())
                      .add(7, 'day')
                      .toDate()
                  )
                })
              }}
            >
              <div>Maju</div>

              <ChevronRight size={16} />
            </Button>
          )}
        </div>
      </div>

      {/* Dev's note: assuming the status applies always for "today", it doesn't make sense to change this on transition.  */}
      {isLoadingProp ? (
        <Skeleton className='w-full h-16 rounded-t-none' />
      ) : (
        <ProgressGridStatus {...statusProps} />
      )}
    </div>
  )
}

/**
 * `<ProgressGrid>` component wrapped with event handlers to update the query parameters whenever the date changes.
 */
export function ProgressGridWithNavigation(props: Omit<Props, 'onChangeDate'>) {
  const router = useRouter()

  return (
    <ProgressGrid
      {...props}
      onChangeDate={(newDate) => {
        const currentUrl = new URL(window.location.href)
        currentUrl.searchParams.set(
          ACTIVITY_CURRENT_DATE_QUERY_PARAMETER,
          dayjsClientSideLocal(newDate.toISOString()).format(
            ACTIVITY_CURRENT_DATE_QUERY_PARAMETER_DATE_FORMAT
          )
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
  const dayjsObject = dayjsClientSideLocal(dateString)
  const isActive = dayjsObject.isSame(new Date(), 'day')

  return (
    <time
      dateTime={dayjsObject.format('YYYY-MM-DD')}
      className={
        isActive
          ? 'rounded-full w-5 h-5 mx-auto flex items-center justify-center bg-khutwah-red-light text-khutwah-neutral-white'
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
      attendance: undefined,
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
