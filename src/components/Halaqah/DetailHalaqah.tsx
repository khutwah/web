'use client'

import { Search } from 'lucide-react'
import { Input } from '../Form/Input'
import { Students } from '@/utils/supabase/models/students'
import { Activities } from '@/utils/supabase/models/activities'
import { useState } from 'react'
import { ActivityTypeKey } from '@/models/activities'
import { SantriCard } from '../SantriCard/SantriCard'
import SampleSantriAvatar from '@/assets/sample-ustadz-photo.png'
import { MENU_PATH_RECORD } from '@/utils/menus/ustadz'

interface Props {
  students: NonNullable<Awaited<ReturnType<Students['list']>>['data']>
  activities: NonNullable<Awaited<ReturnType<Activities['list']>>['data']>
}

type StudentRecordValue = Props['students'][number] & {
  activities: ActivityTypeKey[]
}

export function HalaqahDetailContent({ students, activities }: Props) {
  const [defaultStudentsWithActivities] = useState(() => {
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
  })
  const [filteredStudents, setFilteredStudents] = useState(
    defaultStudentsWithActivities
  )

  return (
    <div className='flex flex-col gap-y-6'>
      <div className='flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 w-full'>
        <span className='flex select-none items-center pl-3 text-gray-500 sm:text-sm'>
          <Search size={12} aria-hidden />
        </span>
        <Input
          id='search-santri'
          name='search-santri'
          type='text'
          placeholder='Cari santri...'
          className='border-0 focus-visible:ring-0'
          onChange={(e) => {
            if (!e.target.value)
              return setFilteredStudents(defaultStudentsWithActivities)

            setFilteredStudents(
              defaultStudentsWithActivities.filter((student) =>
                student.name
                  ?.toLowerCase()
                  .includes(e.target.value.toLowerCase())
              )
            )
          }}
        />
      </div>

      <ol className='flex flex-col gap-y-3'>
        {filteredStudents?.map((student) => (
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
    </div>
  )
}
