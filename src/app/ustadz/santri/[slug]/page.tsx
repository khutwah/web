import { Layout } from '@/components/Layout/Ustadz'
import { Navbar } from '@/components/Navbar/Navbar'
import { SantriActivityHeader } from '@/components/SantriActivity/Header'
import ProgressViewCard from './components/ProgressView/ProgressViewCard'
import { Students } from '@/utils/supabase/models/students'
import {
  ProgressViewToggle,
  ProgressViewToggleProps
} from './components/ProgressView/PorgressViewToggle'
import {
  ACTIVITY_VIEW_QUERY_PARAMETER,
  ACTIVITY_CURRENT_DATE_QUERY_PARAMETER,
  ACTIVITY_PERIOD_QUERY_PARAMETER,
  ACTIVITY_CURRENT_DATE_QUERY_PARAMETER_DATE_FORMAT,
  ActivityType,
  ACTIVITY_CONVERT_TO_DRAFT_PARAMETER,
  ACTIVITY_ID_PARAMETER
} from '@/models/activities'
import getTimezoneInfo from '@/utils/get-timezone-info'
import {
  convertSearchParamsToPath,
  convertSearchParamsToStringRecords
} from '@/utils/url'
import { Activities } from '@/utils/supabase/models/activities'
import { CheckpointStatus } from '@/models/checkpoints'

import ActivityCtaSection from './components/sections/ActivityCtaSection'
import AssessmentSection from './components/sections/AssessmentSection'
import LastActivitiesSection from './components/sections/LastActivitiesSection'
import { MENU_USTADZ_PATH_RECORDS } from '@/utils/menus/ustadz'
import { dayjs } from '@/utils/dayjs'
import { getUserRole } from '@/utils/supabase/get-user-role'
import { ROLE } from '@/models/auth'
import { getNextLajnahAssessment } from '@/utils/assessments'
import { Checkpoints } from '@/utils/supabase/models/checkpoints'

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
  const role = await getUserRole()

  const params = await paramsPromise
  const searchParams = await searchParamsPromise

  // Exclude <ActivityCard> related props, because they are irrelevant inside the Add/Edit Activity view.
  // `periodQueryParameter` is of type `ProgressChartPeriod`.
  const {
    [ACTIVITY_CURRENT_DATE_QUERY_PARAMETER]: currentDateQueryParameter,
    [ACTIVITY_VIEW_QUERY_PARAMETER]: viewQueryParameter,
    [ACTIVITY_CONVERT_TO_DRAFT_PARAMETER]: convertToDraftQueryParameter,
    [ACTIVITY_ID_PARAMETER]: activityIdQueryParameter,
    ...searchStringRecords
  } = convertSearchParamsToStringRecords(searchParams, [
    ACTIVITY_PERIOD_QUERY_PARAMETER
  ])

  const day = dayjs
    .utc(
      currentDateQueryParameter,
      ACTIVITY_CURRENT_DATE_QUERY_PARAMETER_DATE_FORMAT
    )
    .tz(tz)
  const startDateWeek = day.startOf('week')
  const isCurrentWeek = startDateWeek.isSame(dayjs.utc().tz(tz), 'week')
  const isChartView = viewQueryParameter === 'chart'

  const studentId = Number(params.slug)
  const studentsInstance = new Students()
  const activitiesInstance = new Activities()
  const checkpointsInstance = new Checkpoints()
  const [
    student,
    isStudentManagedByUser,
    latestCheckpoint,
    latestSabaq,
    activitiesForToday,
    checkpoints
  ] = await Promise.all([
    studentsInstance.get(studentId),
    studentsInstance.isStudentManagedByUser(studentId),
    activitiesInstance.checkpoint({
      student_id: studentId
    }),
    activitiesInstance.getLatestSabaq({ studentId }),
    activitiesInstance.listForDay(
      studentId,
      [ActivityType.Sabaq, ActivityType.Sabqi, ActivityType.Manzil],
      day
    ),
    checkpointsInstance.list({ student_id: studentId })
  ])
  const checkpoint = checkpoints.data?.[0]
  const isStudentActive =
    (latestCheckpoint?.status as CheckpointStatus) !== 'inactive'
  const isAllowedToStartAssessment =
    isStudentActive && (isStudentManagedByUser || role === ROLE.LAJNAH)

  if (convertToDraftQueryParameter === 'true' && activityIdQueryParameter) {
    await activitiesInstance.convertToDraft(Number(activityIdQueryParameter))
  }

  const sessionRangeId = getNextLajnahAssessment(
    latestSabaq?.end_surah,
    latestSabaq?.end_verse
  )

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
        returnTo={`${MENU_USTADZ_PATH_RECORDS.home}${convertSearchParamsToPath(searchParams)}`}
      />
      <div className='bg-khutwah-red-base w-full p-4 h-[225px] absolute -z-10' />

      <div className='flex flex-col p-6 gap-y-4'>
        <div className='flex justify-center gap-x-[6.5px] text-khutwah-neutral-white text-khutwah-m-regular'>
          <SantriActivityHeader
            hasJumpToTodayLink={!isCurrentWeek && !isChartView}
          />
        </div>

        <ProgressViewCard
          sessionRangeId={sessionRangeId}
          student={student.data}
          latestCheckpoint={latestCheckpoint}
          checkpoint={checkpoint}
          isStudentManagedByUser={isStudentManagedByUser}
          searchParams={searchParams}
          tz={tz}
          day={day}
        />
      </div>

      {isAllowedToStartAssessment && (
        <AssessmentSection
          studentId={studentId}
          role={role}
          sessionRangeId={sessionRangeId}
          checkpoint={checkpoint}
        />
      )}

      {isStudentActive && isStudentManagedByUser && (
        <ActivityCtaSection
          searchStringRecords={searchStringRecords}
          student={student.data}
          activitiesForToday={activitiesForToday.data || []}
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
