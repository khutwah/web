'use client'

import { Students } from '@/utils/supabase/models/students'
import { Activities } from '@/utils/supabase/models/activities'
import { useContext, useMemo } from 'react'
import { ActivityTypeKey } from '@/models/activities'
import {
  SantriCard,
  SantriCardSkeleton
} from '../../../../components/SantriCard/SantriCard'
import SampleSantriAvatar from '@/assets/sample-ustadz-photo.png'
import { MENU_PATH_RECORD } from '@/utils/menus/ustadz'
import { SearchContext } from '../Search/SearchProvider'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DEFAULT_EMPTY_ARRAY: any[] = []

interface Props {
  students: Awaited<ReturnType<Students['list']>>['data']
  activities: Awaited<ReturnType<Activities['list']>>['data']
}

type StudentRecordValue = NonNullable<Props['students']>[number] & {
  activities: ActivityTypeKey[]
}

export function SantriList({
  students: studentsProp,
  activities: activitiesProp
}: Props) {
  const defaultStudentsWithActivities = useMemo(() => {
    const students = studentsProp ?? DEFAULT_EMPTY_ARRAY
    const activities = activitiesProp ?? DEFAULT_EMPTY_ARRAY

    const studentRecord: Record<number, StudentRecordValue> = {}

    for (const student of students) {
      studentRecord[student.id] = { ...student, activities: [] }
    }

    for (const activity of activities) {
      if (!activity.student_id || !studentRecord[activity.student_id]) continue

      studentRecord[activity.student_id].activities.push(
        activity.type as ActivityTypeKey
      )
    }

    return Object.values(studentRecord)
  }, [studentsProp, activitiesProp])

  const searchContext = useContext(SearchContext)
  if (searchContext === undefined) {
    throw new Error('SearchSection must be used within a SearchContext')
  }

  const filteredStudents = defaultStudentsWithActivities.filter((student) =>
    student.name?.toLowerCase().includes(searchContext.searchQuery)
  )

  return (
    <ol className='flex flex-col gap-y-3'>
      {filteredStudents.map((student) => (
        <li key={student.id}>
          <SantriCard
            activities={student.activities}
            avatarUrl={SampleSantriAvatar}
            href={`${MENU_PATH_RECORD.santri}/${student.id}`}
            name={student.name!}
          />
        </li>
      ))}
    </ol>
  )
}

export function SantriListSkeleton() {
  return (
    <div className='flex flex-col gap-y-3'>
      <SantriCardSkeleton />
      <SantriCardSkeleton />
      <SantriCardSkeleton />
    </div>
  )
}
