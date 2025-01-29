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

  const students = await studentInstance.listWithCheckpoints({
    ustadz_id: ustadzId,
    checkpoint_statuses: checkpointStatuses
  })

  const studentIds = students.data?.map(({ student_id }) => student_id ?? 0)
  if (!studentIds) {
    throw new Error('Failed to fetch students')
  }

  const activities = await activitiesInstance.list({
    ustadz_id: ustadzId,
    start_date: day.startOf('day').utc().toISOString(),
    end_date: day.endOf('day').utc().toISOString(),
    limit: studentIds.length * 3
  })

  if ('data' in activities) {
    const lastSabaqList = studentIds
      ? await activitiesInstance.listLatestSabaq(studentIds)
      : []
    const studentsData = students.data?.map(
      ({ student_id, student_name, circle_name, checkpoint_status }) => ({
        id: student_id,
        status: checkpoint_status,
        name: student_name || '',
        circle_name: circle_name || '',
        lastSabaq: (() => {
          const sabaq = lastSabaqList.find(
            (sabaq) => sabaq.student_id === student_id
          )
          return {
            id: sabaq?.id ?? undefined,
            student_id: sabaq?.student_id,
            end_surah: sabaq?.end_surah,
            end_verse: sabaq?.end_verse,
            targetPageCount: sabaq?.target_page_count ?? undefined
          }
        })()
      })
    )

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
