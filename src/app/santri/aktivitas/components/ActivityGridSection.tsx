import dayjs from '@/utils/dayjs'
import { Suspense } from 'react'

import { SantriActivityHeader } from '@/components/SantriActivity/Header'
import { Card, CardContent } from '@/components/Card/Card'
import {
  ProgressGridSkeleton,
  ProgressGridWithNav
} from '@/components/Progress/ProgressGrid'
import { StateMessage } from '@/components/StateMessage/StateMessage'
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary'

import { Activities } from '@/utils/supabase/models/activities'
import { getUser } from '@/utils/supabase/get-user'
import getTimezoneInfo from '@/utils/get-timezone-info'
import {
  ACTIVITY_CURRENT_DATE_QUERY_PARAMETER,
  ACTIVITY_CURRENT_DATE_QUERY_PARAMETER_DATE_FORMAT,
  ACTIVITY_VIEW_QUERY_PARAMETER
} from '@/models/activities'
import { convertSearchParamsToStringRecords } from '@/utils/url'

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function ActivityGridSection({
  searchParams: searchParamsPromise
}: Props) {
  const searchParams = await searchParamsPromise

  const { [ACTIVITY_CURRENT_DATE_QUERY_PARAMETER]: currentDateQueryParameter } =
    convertSearchParamsToStringRecords(searchParams)
  const tz = await getTimezoneInfo()
  const day = dayjs
    .utc(
      currentDateQueryParameter,
      ACTIVITY_CURRENT_DATE_QUERY_PARAMETER_DATE_FORMAT
    )
    .tz(tz)

  // FIXME(dio-khutwah): When we refactor this, we should probably move this somewhere else.
  const isChartView = searchParams[ACTIVITY_VIEW_QUERY_PARAMETER] === 'chart'
  const startDateWeek = day.startOf('week')
  const isCurrentWeek = startDateWeek.isSame(dayjs().tz(tz), 'week')

  return (
    <section className='flex flex-col gap-y-4'>
      <div className='flex justify-center gap-x-[6.5px] text-mtmh-neutral-white text-mtmh-m-regular'>
        <SantriActivityHeader
          hasJumpToTodayLink={!isChartView && !isCurrentWeek}
        />
      </div>

      <Card className='bg-mtmh-neutral-white text-mtmh-grey-base shadow-md border border-mtmh-snow-lighter rounded-md'>
        <CardContent className='flex flex-col p-0 gap-y-3'>
          <ErrorBoundary
            fallback={
              <StateMessage
                className='py-8 px-4'
                description='Tidak dapat menampilkan data progres aktivitas'
                title='Terjadi Kesalahan'
                type='error'
              />
            }
          >
            <Suspense fallback={<ProgressGridSkeleton />}>
              <ActivityGrid searchParams={searchParams} />
            </Suspense>
          </ErrorBoundary>
        </CardContent>
      </Card>
    </section>
  )
}

async function ActivityGrid({
  searchParams
}: {
  searchParams: Awaited<Props['searchParams']>
}) {
  const user = await getUser()
  const { [ACTIVITY_CURRENT_DATE_QUERY_PARAMETER]: currentDateQueryParameter } =
    convertSearchParamsToStringRecords(searchParams)

  // This gets the current day in the client's timezone.
  const tz = await getTimezoneInfo()
  const day = dayjs
    .utc(
      currentDateQueryParameter,
      ACTIVITY_CURRENT_DATE_QUERY_PARAMETER_DATE_FORMAT
    )
    .tz(tz)

  const activitiesInstance = new Activities()
  const activities = await activitiesInstance.list({
    parent_id: user.data?.id,
    start_date: day.startOf('week').toISOString(),
    end_date: day.endOf('week').toISOString(),
    limit: 21
  })

  return (
    <ProgressGridWithNav
      date={day.toDate()}
      activities={activities.data}
      className='border-none rounded-none'
    />
  )
}
