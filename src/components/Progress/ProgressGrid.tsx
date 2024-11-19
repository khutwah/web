import { ActivityTypeKey } from '@/models/activities'
import { Activities } from '@/utils/supabase/models/activities'
import { addDays, isAfter, isSameDay } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'
import { ActivityBadge } from '../Badge/ActivityBadge'
import { Dispatch, ReactNode, SetStateAction } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import ThumbsUpImage from './indikator-manzil.png'

type ActivityEntry = NonNullable<
  Awaited<ReturnType<Activities['list']>>['data']
>[number]

interface Props {
  activities: Array<Pick<ActivityEntry, 'page_amount' | 'type' | 'created_at'>>
  date: Date
  onChangeDate: Dispatch<SetStateAction<Date>>
  // The number of juz that the student has almost reached.
  manzilJuzMilestone?: number
}

export function ProgressGrid({
  activities,
  date,
  onChangeDate,
  manzilJuzMilestone
}: Props) {
  const startDate = addDays(date, -2)
  const endDate = addDays(date, 2)

  const { grid, headers } = getInitialVariables(startDate, endDate)

  const grids: Record<ActivityTypeKey, Record<string, number>> = {
    Sabaq: grid,
    Sabqi: { ...grid },
    Manzil: { ...grid }
  }
  const gridKeys = Object.keys(grids) as Array<ActivityTypeKey>

  for (const activity of activities) {
    const { type: rawType, created_at, page_amount } = activity
    const type = rawType as ActivityTypeKey

    // Assumption: if page_amount is null, then the student was absent.
    if (!grids[type] || !created_at || page_amount === null) continue

    const gridId = getGridIdentifier(new Date(created_at))
    grids[type][gridId] = page_amount
  }

  return (
    <div className='w-[307px] flex flex-col border border-mtmh-snow-lighter rounded-lg'>
      <div className='w-full flex flex-col gap-y-3 p-3'>
        <table className='[&>*>*>td]:p-1 [&>*>*>td]:text-center w-full'>
          <thead>
            <tr className='text-mtmh-xs-regular h-[28px]'>
              <td className='text-mtmh-xs-semibold text-mtmh-red-light w-[51px]'>
                {formatInTimeZone(date, 'Asia/Jakarta', 'MMM yy')}
              </td>
              {headers.map((header) => {
                const headerDate = new Date(header)

                return (
                  <td key={header}>
                    <TableHeaderDate
                      isActive={isSameDay(headerDate, new Date())}
                    >
                      {formatInTimeZone(headerDate, 'Asia/Jakarta', 'dd')}
                    </TableHeaderDate>
                  </td>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {gridKeys.map((activityName) => (
              <tr>
                <td className='text-mtmh-sm-semibold'>{activityName}</td>
                {headers.map((header) => {
                  const headerKey = getGridIdentifier(new Date(header))
                  const pageAmount = grids[activityName][headerKey]

                  return (
                    <td key={header}>
                      <ActivityBadge
                        type={activityName}
                        isStudentPresent={pageAmount !== -1}
                        text={pageAmount > -1 ? `${pageAmount}` : '-'}
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
            onClick={() => onChangeDate((prevDate) => addDays(prevDate, -5))}
          >
            <ChevronLeft size={16} />

            <div>Mundur</div>
          </button>

          <button
            className='flex gap-x-2'
            onClick={() => onChangeDate((prevDate) => addDays(prevDate, 5))}
          >
            <div>Maju</div>

            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {manzilJuzMilestone && (
        <div className='flex p-3 gap-x-2 bg-mtmh-tamarind-lightest border-t border-mtmh-snow-lighter'>
          <div>
            <Image
              alt='Jempol arah ke atas'
              src={ThumbsUpImage}
              width={32}
              height={32}
            />
          </div>

          <div className='flex flex-1 flex-col gap-y-1 text-mtmh-tamarind-darkest'>
            <div className='text-mtmh-m-semibold'>Siap-siap manzil...</div>

            <div className='text-mtmh-sm-regular'>
              Alhamdulillah, hafalan ananda sudah mendekati {manzilJuzMilestone}{' '}
              juz.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function TableHeaderDate({
  isActive,
  children
}: {
  isActive: boolean
  children: ReactNode
}) {
  return (
    <div
      className={
        isActive
          ? 'rounded-full w-5 h-5 mx-auto flex items-center justify-center bg-mtmh-red-light text-mtmh-neutral-white'
          : undefined
      }
    >
      {children}
    </div>
  )
}

function getInitialVariables(startDate: Date, endDate: Date) {
  const grid: Record<string, number> = {}
  const headers: string[] = []
  let iterator = startDate

  while (!isAfter(iterator, endDate)) {
    grid[getGridIdentifier(iterator)] = -1
    headers.push(iterator.toISOString())

    iterator = addDays(iterator, 1)
  }

  return { grid, headers }
}

function getGridIdentifier(date: Date) {
  return formatInTimeZone(date, 'Asia/Jakarta', 'dd')
}
