import { ActivityTypeKey } from '@/models/activities'
import { Activities } from '@/utils/supabase/models/activities'
import { ActivityBadge } from '../Badge/ActivityBadge'
import { Dispatch, ReactNode, SetStateAction } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import ThumbsUpImage from './indikator-manzil.png'
import dayjsGmt7 from '@/utils/dayjs-gmt7'
import dayjs, { Dayjs } from 'dayjs'

type ActivityEntry = NonNullable<
  Awaited<ReturnType<Activities['list']>>['data']
>[number]

interface Props {
  activities: Array<Pick<ActivityEntry, 'page_amount' | 'type' | 'created_at'>>
  date: Date
  onChangeDate: Dispatch<SetStateAction<Date>>
  // The number of juz that the student has almost reached.
  lajnahJuzMilestone?: number
}

export function ProgressGrid({
  activities,
  date,
  onChangeDate,
  lajnahJuzMilestone
}: Props) {
  const startDate = dayjs(date).day(0)
  const endDate = dayjs(date).day(6)

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
                {dayjsGmt7(date).format('MMM YY')}
              </td>
              {headers.map((header) => {
                const headerDate = new Date(header)

                return (
                  <td key={header}>
                    <TableHeaderDate
                      isActive={dayjs(headerDate).isSame(new Date(), 'day')}
                    >
                      {dayjsGmt7(headerDate).format('DD')}
                    </TableHeaderDate>
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

      {lajnahJuzMilestone && (
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
            <div className='text-mtmh-m-semibold'>Siap-siap lajnah...</div>

            <div className='text-mtmh-sm-regular'>
              Alhamdulillah, hafalan ananda sudah mendekati {lajnahJuzMilestone}{' '}
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

function getInitialVariables(startDate: Dayjs, endDate: Dayjs) {
  const grid: Record<string, number> = {}
  const headers: string[] = []
  let iterator = startDate

  while (!iterator.isAfter(endDate)) {
    grid[getGridIdentifier(iterator.toDate())] = -1
    headers.push(iterator.toISOString())

    iterator = iterator.add(1, 'day')
  }

  return { grid, headers }
}

function getGridIdentifier(date: Date) {
  return dayjsGmt7(date).format('dd')
}
