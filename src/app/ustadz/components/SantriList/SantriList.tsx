'use client'

import { useContext, useMemo } from 'react'

import {
  SantriCard,
  SantriCardSkeleton
} from '@/components/SantriCard/SantriCard'
import { SearchContext } from '@/app/ustadz/components/Search/SearchProvider'
import { StateMessage } from '@/components/StateMessage/StateMessage'

import { Activities } from '@/utils/supabase/models/activities'
import { MENU_USTADZ_PATH_RECORDS } from '@/utils/menus/ustadz'
import { addFromQueryString, FromQueryParams } from '@/utils/url'
import { MappedActivityStatus } from '@/models/activities'

import SampleSantriAvatar from '@/assets/sample-santri-photo.png'
import { CheckpointStatus } from '@/models/checkpoints'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DEFAULT_EMPTY_ARRAY: any[] = []

export interface SantriListProps {
  students: Array<{
    id: number | null
    name: string
    status: string | null
    circle_name?: string
    lastSabaq: {
      id: number | undefined
      student_id: number | null | undefined
      end_surah: number | null | undefined
      end_verse: number | null | undefined
      targetPageCount: number | undefined
    }
  }> | null
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

  const filteredStudents = defaultStudentsWithActivities.filter(({ name }) =>
    name?.toLowerCase().includes(searchContext.searchQuery.toLowerCase())
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
            status={student.status as CheckpointStatus}
            lastSabaq={{
              end_surah: student.lastSabaq.end_surah || 0,
              end_verse: student.lastSabaq.end_verse || 0
            }}
            halaqahName={student.circle_name}
            activities={student.activities}
            avatarUrl={SampleSantriAvatar}
            href={`${MENU_USTADZ_PATH_RECORDS.santri}/${student.id}${addFromQueryString(from)}`}
            name={student.name}
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
