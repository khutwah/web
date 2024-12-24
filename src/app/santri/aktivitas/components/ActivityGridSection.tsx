import dayjs from '@/utils/dayjs'
import { Suspense } from 'react'

import { SantriActivityHeader } from '@/components/SantriActivity/Header'
import { Card, CardContent } from '@/components/Card/Card'
import {
  ProgressGridSkeleton,
  ProgressGridWithNavigation
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
import { Students } from '@/utils/supabase/models/students'
import { Checkpoint } from '@/utils/supabase/models/checkpoint'
import { CheckpointStatus } from '@/models/checkpoint'
import { parseParameter } from '@/utils/parse-parameter'

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
  const parent = await getUser()
  const studentsInstance = new Students()
  const student = await studentsInstance.getByParentId(parent.data!.id)

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
  const checkpointInstance = new Checkpoint()

  const [activities, latestCheckpoint, checkpoints] = await Promise.all([
    activitiesInstance.list({
      parent_id: parent.data?.id,
      start_date: day.startOf('week').toISOString(),
      end_date: day.endOf('week').toISOString(),
      limit: 21
    }),
    activitiesInstance.checkpoint({
      student_id: student.data!.id
    }),
    checkpointInstance.list({
      student_id: student.data?.id
    })
  ])
  const checkpointData = checkpoints.data?.[0]

  return (
    <ProgressGridWithNavigation
      date={day.toDate()}
      activities={activities.data}
      className='border-none rounded-none'
      statusProps={{
        editable: false,
        status: checkpointData?.status as CheckpointStatus,
        parameter: parseParameter(checkpointData),
        checkpointId: checkpointData?.id,
        lastActivityId: latestCheckpoint?.last_activity_id,
        pageCountAccumulation: latestCheckpoint?.page_count_accumulation,
        studentId: student.data?.id,
        notes: latestCheckpoint?.notes,
        partCount: latestCheckpoint?.part_count
      }}
    />
  )
}
