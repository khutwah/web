import { Card, CardContent, CardHeader } from '@/components/Card/Card'
import Image from 'next/image'
import SampleSantriAvatar from '@/assets/sample-santri-photo.png'
import { StateMessage } from '@/components/StateMessage/StateMessage'
import { cn } from '@/utils/classnames'
import { Activities } from '@/utils/supabase/models/activities'
import {
  ACTIVITY_PERIOD_QUERY_PARAMETER,
  ACTIVITY_VIEW_QUERY_PARAMETER
} from '@/models/activities'
import { Dayjs } from '@/utils/dayjs'
import { ProgressChartWithNavigation } from '@/components/Progress/ProgressChart'
import { Checkpoints } from '@/utils/supabase/models/checkpoints'
import { ProgressGridWithNavigation } from '@/components/Progress/ProgressGrid'
import { CheckpointStatus } from '@/models/checkpoints'
import { parseParameter } from '@/utils/parse-parameter'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DEFAULT_EMPTY_ARRAY: any[] = []

interface Student {
  id: number
  name: string | null
  circles: {
    id: number | null
    name: string | null
  } | null
}

interface Checkpoint {
  last_activity_id: number | undefined | null
  page_count_accumulation: number | undefined | null
  part_count: number | undefined | null
  notes: string | undefined | null
  status: string | undefined
}

interface ProgressViewCardProps {
  student: Student | null
  latestCheckpoint: Checkpoint | null
  isStudentManagedByUser: boolean
  searchParams: { [key: string]: string | string[] | undefined }
  tz: string
  day: Dayjs
}

type ProgressViewCardHeaderProps = Omit<
  ProgressViewCardProps,
  'latestCheckpoint' | 'isStudentManagedByUser' | 'searchParams' | 'tz' | 'day'
>
type ProgressViewCardContentProps = ProgressViewCardProps

export default async function ProgressViewCard({
  student,
  latestCheckpoint,
  isStudentManagedByUser,
  searchParams,
  tz,
  day
}: ProgressViewCardProps) {
  return (
    <Card className='bg-mtmh-neutral-white text-mtmh-grey-base shadow-md border border-mtmh-snow-lighter rounded-md mb-2'>
      <ProgressViewCardHeader student={student} />
      <ProgressViewCardContent
        student={student}
        latestCheckpoint={latestCheckpoint}
        isStudentManagedByUser={isStudentManagedByUser}
        searchParams={searchParams}
        tz={tz}
        day={day}
      />
    </Card>
  )
}

function ProgressViewCardHeader({ student }: ProgressViewCardHeaderProps) {
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
    <CardHeader className='flex flex-row justify-between items-center border-b border-b-mtmh-snow-lighter'>
      <div>
        <div className='text-mtmh-l-semibold text-mtmh-grey-base'>
          {student?.name}
        </div>
        <div className='text-mtmh-m-regular text-mtmh-grey-lighter'>
          {student?.circles?.name}
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
  isStudentManagedByUser,
  searchParams,
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
  const checkpointsInstance = new Checkpoints()

  const [activitiesChart, activities, checkpoints] = await Promise.all([
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
    }),
    checkpointsInstance.list({ student_id: student.id })
  ])
  const checkpoint = checkpoints.data?.at(0)

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
            editable: isStudentManagedByUser,
            status: checkpoint?.status as CheckpointStatus,
            parameter: parseParameter(checkpoint),
            checkpointId: checkpoint?.id,
            lastActivityId: latestCheckpoint?.last_activity_id,
            pageCountAccumulation: latestCheckpoint?.page_count_accumulation,
            studentId: student.id,
            notes: latestCheckpoint?.notes,
            partCount: latestCheckpoint?.part_count
          }}
        />
      )}
    </CardContent>
  )
}
