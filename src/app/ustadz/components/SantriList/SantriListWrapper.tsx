import {
  SantriList,
  type SantriListProps
} from '@/app/ustadz/components/SantriList/SantriList'

import { dayjs } from '@/utils/dayjs'
import getTimezoneInfo from '@/utils/get-timezone-info'
import { CheckpointStatus } from '@/models/checkpoints'
import { Students } from '@/utils/supabase/models/students'
import { Activities } from '@/utils/supabase/models/activities'

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

  const studentInstance = new Students()
  const activitiesInstance = new Activities()

  const [students, activities] = await Promise.all([
    studentInstance.listWithCheckpoints({
      ustadz_id: ustadzId,
      checkpoint_statuses: checkpointStatuses
    }),
    activitiesInstance.list({
      ustadz_id: ustadzId,
      start_date: day.startOf('day').utc().toISOString(),
      end_date: day.endOf('day').utc().toISOString()
    })
  ])

  if ('data' in students && 'data' in activities) {
    const studentIds = students.data?.map(({ id }) => id)
    const lastSabaqList = studentIds
      ? await activitiesInstance.listLatestSabaq(studentIds)
      : []
    const studentsData = students.data?.map(({ id, name }) => ({
      id,
      name: name || '',
      lastSabaq: (() => {
        const sabaq = lastSabaqList.find((sabaq) => sabaq.student_id === id)
        return {
          id: sabaq?.id ?? undefined,
          student_id: sabaq?.student_id,
          end_surah: sabaq?.end_surah,
          end_verse: sabaq?.end_verse,
          targetPageCount: sabaq?.target_page_count ?? undefined
        }
      })()
    }))

    return (
      <SantriList
        students={studentsData || []}
        activities={activities.data}
        from={from}
        emptyState={emptyState}
      />
    )
  }

  return null
}
