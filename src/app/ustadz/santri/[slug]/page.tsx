import { Layout } from '@/components/Layouts/Ustadz'
import { Navbar } from '@/components/Navbar/Navbar'
import { SantriActivityHeader } from '@/components/SantriActivity/Header'
import ProgressViewCard from './components/ProgressView/Card'
import { Students } from '@/utils/supabase/models/students'
import {
  ProgressViewToggle,
  ProgressViewToggleProps
} from './components/ProgressView/Toggle'
import {
  ACTIVITY_VIEW_QUERY_PARAMETER,
  ACTIVITY_CURRENT_DATE_QUERY_PARAMETER,
  ACTIVITY_PERIOD_QUERY_PARAMETER
} from '@/models/activities'
import getTimezoneInfo from '@/utils/get-timezone-info'
import { convertSearchParamsToStringRecords } from '@/utils/url'
import { Activities } from '@/utils/supabase/models/activities'
import { CheckpointStatus } from '@/models/checkpoints'

import ActivityCtaSection from './components/sections/ActivityCtaSection'
import AssessmentSection from './components/sections/AssessmentSection'
import LastActivitiesSection from './components/sections/LastActivitiesSection'

interface DetailSantriProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function DetailSantri({
  params: paramsPromise,
  searchParams: searchParamsPromise
}: DetailSantriProps) {
  // This gets the current day in the client's timezone.
  const tz = await getTimezoneInfo()

  const params = await paramsPromise
  const searchParams = await searchParamsPromise

  const studentId = Number(params.slug)
  const studentsInstance = new Students()
  const activitiesInstance = new Activities()
  const [student, isStudentManagedByUser, latestCheckpoint] = await Promise.all(
    [
      studentsInstance.get(studentId),
      studentsInstance.isStudentManagedByUser(studentId),
      activitiesInstance.checkpoint({
        student_id: studentId
      })
    ]
  )
  const isActive = (latestCheckpoint?.status as CheckpointStatus) !== 'inactive'

  return (
    <Layout>
      <Navbar
        text='Detail Santri'
        rightComponent={
          <ProgressViewToggle
            initialView={
              searchParams[
                ACTIVITY_VIEW_QUERY_PARAMETER
              ] as ProgressViewToggleProps['initialView']
            }
          />
        }
      />
      <div className='bg-mtmh-red-base w-full p-4 h-[225px] absolute -z-10' />

      <div className='flex flex-col p-6 gap-y-4'>
        <div className='flex justify-center gap-x-[6.5px] text-mtmh-neutral-white text-mtmh-m-regular'>
          <SantriActivityHeader />
        </div>

        <ProgressViewCard
          student={student.data}
          latestCheckpoint={latestCheckpoint}
          isStudentManagedByUser={isStudentManagedByUser}
          searchParams={searchParams}
          tz={tz}
        />
      </div>

      {isActive && <AssessmentSection />}

      {isActive && isStudentManagedByUser && (
        <ActivityCtaSection
          searchStringRecords={convertSearchParamsToStringRecords(
            searchParams,
            [
              ACTIVITY_CURRENT_DATE_QUERY_PARAMETER,
              ACTIVITY_VIEW_QUERY_PARAMETER,
              ACTIVITY_PERIOD_QUERY_PARAMETER
            ]
          )}
          student={student.data}
        />
      )}

      <LastActivitiesSection
        studentId={params.slug}
        searchParams={searchParams}
        tz={tz}
      />
    </Layout>
  )
}
