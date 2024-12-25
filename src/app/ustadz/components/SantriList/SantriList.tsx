'use client'

import { useContext, useMemo } from 'react'

import { Activities } from '@/utils/supabase/models/activities'
import {
  SantriCard,
  SantriCardSkeleton
} from '@/components/SantriCard/SantriCard'
import { SearchContext } from '@/app/ustadz/components/Search/SearchProvider'

import { Students } from '@/utils/supabase/models/students'
import { MENU_USTADZ_PATH_RECORDS } from '@/utils/menus/ustadz'
import { addFromQueryString, FromQueryParams } from '@/utils/url'
import { MappedActivityStatus } from '@/models/activities'

import SampleSantriAvatar from '@/assets/sample-santri-photo.png'
import { StateMessage } from '@/components/StateMessage/StateMessage'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DEFAULT_EMPTY_ARRAY: any[] = []

export interface SantriListProps {
  students: Awaited<ReturnType<Students['list']>>['data']
  activities: Awaited<ReturnType<Activities['list']>>['data']
  from: FromQueryParams
  emptyState?: React.ReactNode
}

type StudentRecordValue = NonNullable<SantriListProps['students']>[number] & {
  activities: MappedActivityStatus[]
}

export function SantriList({
  students: studentsProp,
  activities: activitiesProp,
  from,
  emptyState
}: SantriListProps) {
  const defaultStudentsWithActivities = useMemo(() => {
    const students = studentsProp ?? DEFAULT_EMPTY_ARRAY
    const activities = activitiesProp ?? DEFAULT_EMPTY_ARRAY

    const studentRecord: Record<number, StudentRecordValue> = {}

    for (const student of students) {
      studentRecord[student.id] = { ...student, activities: [] }
    }

    for (const activity of activities) {
      if (!activity.student_id || !studentRecord[activity.student_id]) continue

      studentRecord[activity.student_id].activities.push({
        [activity.type]: activity.status
      })
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

  if (filteredStudents.length <= 0) {
    return (
      emptyState || (
        <StateMessage type='empty' title='Tidak Menemukan Data Santri' />
      )
    )
  }

  return (
    <ol className='flex flex-col gap-y-3'>
      {filteredStudents.map((student) => (
        <li key={student.id}>
          <SantriCard
            activities={student.activities}
            avatarUrl={SampleSantriAvatar}
            href={`${MENU_USTADZ_PATH_RECORDS.santri}/${student.id}${addFromQueryString(from)}`}
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
