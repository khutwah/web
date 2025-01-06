import { Card, CardContent, CardHeader } from '@/components/Card/Card'
import Image from 'next/image'
import SampleSantriAvatar from '@/assets/sample-santri-photo.png'
import { StateMessage } from '@/components/StateMessage/StateMessage'
import { cn } from '@/utils/classnames'
import { Activities } from '@/utils/supabase/models/activities'
import {
  ACTIVITY_PERIOD_QUERY_PARAMETER,
  ACTIVITY_VIEW_QUERY_PARAMETER,
  GLOBAL_TARGET_PAGE_COUNT
} from '@/models/activities'
import { Dayjs } from '@/utils/dayjs'
import { ProgressChartWithNavigation } from '@/components/Progress/ProgressChart'
import { ProgressGridWithNavigation } from '@/components/Progress/ProgressGrid'
import { CheckpointStatus } from '@/models/checkpoints'
import { parseParameter } from '@/utils/parse-parameter'
import { TargetPageCount } from '@/components/TargetPageCount/TargetPageCount'
import { StatusCheckpoint, LatestStatusCheckpoint } from '@/models/checkpoints'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DEFAULT_EMPTY_ARRAY: any[] = []

interface Student {
  id: number
  name: string | null
  target_page_count: number | null
  circles: {
    id: number | null
    name: string | null
    target_page_count: number | null
  } | null
}

interface ProgressViewCardProps {
  student: Student | null
  sessionRangeId?: number
  latestCheckpoint: LatestStatusCheckpoint | null
  statusCheckpoint?: StatusCheckpoint
  isEditable: boolean
  searchParams: { [key: string]: string | string[] | undefined }
  tz: string
  day: Dayjs
}

type ProgressViewCardHeaderProps = Omit<
  ProgressViewCardProps,
  'latestCheckpoint' | 'checkpoint' | 'searchParams' | 'tz' | 'day'
>
type ProgressViewCardContentProps = ProgressViewCardProps

export default function ProgressViewCard({
  student,
  sessionRangeId,
  latestCheckpoint,
  statusCheckpoint,
  isEditable,
  searchParams,
  tz,
  day
}: ProgressViewCardProps) {
  return (
    <Card className='bg-khutwah-neutral-white text-khutwah-grey-base shadow-md border border-khutwah-snow-lighter rounded-md mb-2'>
      <ProgressViewCardHeader student={student} isEditable={isEditable} />
      <ProgressViewCardContent
        student={student}
        sessionRangeId={sessionRangeId}
        latestCheckpoint={latestCheckpoint}
        statusCheckpoint={statusCheckpoint}
        isEditable={isEditable}
        searchParams={searchParams}
        tz={tz}
        day={day}
      />
    </Card>
  )
}

function ProgressViewCardHeader({
  student,
  isEditable
}: ProgressViewCardHeaderProps) {
  if (!student || !student.circles) {
    return (
      <StateMessage
        type='error'
        className='py-8'
        title='Terjadi kesalahan'
        description='Tidak dapat memuat data Santri.'
      />
    )
  }

  return (
    <CardHeader className='flex flex-row justify-between items-center border-b border-b-khutwah-snow-lighter'>
      <div>
        <div className='text-khutwah-l-semibold text-khutwah-grey-base'>
          {student?.name}
        </div>
        <div className='text-khutwah-m-regular text-khutwah-grey-lighter mb-2'>
          {student?.circles?.name}
        </div>
        <div className='flex w-fit'>
          <TargetPageCount
            id={student.id}
            editable={isEditable}
            targetPageCount={
              student?.target_page_count ??
              student?.circles?.target_page_count ??
              GLOBAL_TARGET_PAGE_COUNT
            }
          />
        </div>
      </div>

      <Image
        src={SampleSantriAvatar}
        alt=''
        width={52}
        height={52}
        className='rounded-full'
      />
    </CardHeader>
  )
}

async function ProgressViewCardContent({
  student,
  latestCheckpoint,
  statusCheckpoint,
  isEditable,
  searchParams,
  sessionRangeId,
  tz,
  day
}: ProgressViewCardContentProps) {
  if (!student || !student.circles || !latestCheckpoint) {
    return (
      <StateMessage
        type='error'
        className='py-8'
        title='Terjadi kesalahan'
        description='Tidak dapat memuat data Santri.'
      />
    )
  }

  const periodQueryParameter = searchParams[ACTIVITY_PERIOD_QUERY_PARAMETER]
  const viewQueryParameter = searchParams[ACTIVITY_VIEW_QUERY_PARAMETER]
  const chartPeriod = periodQueryParameter === 'month' ? 'month' : 'week'
  const isChartView = viewQueryParameter === 'chart'

  const activitiesInstance = new Activities()

  const [activitiesChart, activities] = await Promise.all([
    activitiesInstance.chart({
      student_id: student.id,
      start_date: day.startOf(chartPeriod).toISOString(),
      end_date: day.endOf(chartPeriod).toISOString(),
      tz
    }),
    activitiesInstance.list({
      student_id: student.id,
      start_date: day.startOf(isChartView ? chartPeriod : 'week').toISOString(),
      end_date: day.endOf(isChartView ? chartPeriod : 'week').toISOString(),
      limit: 21
    })
  ])

  return (
    <CardContent
      className={cn(
        'flex flex-col p-0 gap-y-3 transition-all duration-200 ease-in-out',
        {
          'p-4 pb-0': isChartView
        }
      )}
    >
      {isChartView ? (
        <ProgressChartWithNavigation
          activities={activitiesChart}
          datePeriod={chartPeriod}
        />
      ) : (
        <ProgressGridWithNavigation
          activities={activities.data ?? DEFAULT_EMPTY_ARRAY}
          date={day.toDate()}
          className='border-none rounded-none'
          statusProps={{
            editable: isEditable,
            status: statusCheckpoint?.status as CheckpointStatus,
            parameter: parseParameter(statusCheckpoint),
            checkpointId: statusCheckpoint?.id,
            lastActivityId: latestCheckpoint?.last_activity_id,
            pageCountAccumulation: latestCheckpoint?.page_count_accumulation,
            studentId: student.id,
            notes: latestCheckpoint?.notes,
            partCount: latestCheckpoint?.part_count || sessionRangeId
          }}
        />
      )}
    </CardContent>
  )
}
