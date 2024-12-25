import {
  SantriList,
  type SantriListProps
} from '@/app/ustadz/components/SantriList/SantriList'

import { dayjs } from '@/utils/dayjs'
import getTimezoneInfo from '@/utils/get-timezone-info'
import { CheckpointStatus } from '@/models/checkpoint'
import { getStudents } from '@/app/actions/student'
import { getActivities } from '@/app/actions/activity'

type SantriListWrapperProps = Pick<SantriListProps, 'from'> & Filter

type Filter = {
  ustadzId?: number
  checkpointStatuses?: Array<CheckpointStatus>
  emptyState?: React.ReactNode
}

export async function SantriListWrapper({
  from,
  checkpointStatuses,
  ustadzId,
  emptyState
}: SantriListWrapperProps) {
  const tz = await getTimezoneInfo()
  const day = dayjs().tz(tz)

  const [students, activities] = await Promise.all([
    getStudents({ ustadzId, checkpointStatuses }),
    getActivities({
      startDate: day.startOf('day').utc().toISOString(),
      endDate: day.endOf('day').utc().toISOString()
    })
  ])

  if ('data' in students && 'data' in activities) {
    return (
      <SantriList
        students={students.data}
        activities={activities.data}
        from={from}
        emptyState={emptyState}
      />
    )
  }

  return null
}
