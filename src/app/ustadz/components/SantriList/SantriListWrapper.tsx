import {
  SantriList,
  type SantriListProps
} from '@/app/ustadz/components/SantriList/SantriList'

import { Students } from '@/utils/supabase/models/students'
import { Activities } from '@/utils/supabase/models/activities'
import { dayjs } from '@/utils/dayjs'
import getTimezoneInfo from '@/utils/get-timezone-info'
import { CheckpointStatus } from '@/models/checkpoint'

type SantriListWrapperProps = Pick<SantriListProps, 'from'> & Filter

type Filter = {
  ustadzId?: number
  checkpointStatuses?: Array<CheckpointStatus>
}

export async function SantriListWrapper({
  from,
  checkpointStatuses,
  ustadzId
}: SantriListWrapperProps) {
  const tz = await getTimezoneInfo()
  const day = dayjs().tz(tz)

  const studentsInstance = new Students()
  const activitiesInstance = new Activities()

  const [students, activities] = await Promise.all([
    studentsInstance.list({
      checkpoint_statuses: checkpointStatuses,
      ustadz_id: ustadzId
    }),
    activitiesInstance.list({
      start_date: day.startOf('day').utc().toISOString(),
      end_date: day.endOf('day').utc().toISOString()
    })
  ])
  return (
    <SantriList
      students={students.data}
      activities={activities.data}
      from={from}
    />
  )
}
