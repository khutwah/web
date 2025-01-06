import { Layout } from '@/components/Layout/Ustadz'
import { Navbar } from '@/components/Navbar/Navbar'
import { SantriActivityHeader } from '@/components/SantriActivity/Header'
import ProgressViewCard from '../ProgressView/ProgressViewCard'
import { Students } from '@/utils/supabase/models/students'
import {
  ProgressViewToggle,
  ProgressViewToggleProps
} from '../ProgressView/PorgressViewToggle'
import {
  ACTIVITY_VIEW_QUERY_PARAMETER,
  ACTIVITY_CURRENT_DATE_QUERY_PARAMETER,
  ACTIVITY_PERIOD_QUERY_PARAMETER,
  ACTIVITY_CURRENT_DATE_QUERY_PARAMETER_DATE_FORMAT,
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

import AssessmentSection from '../sections/AssessmentSection'
import { MENU_USTADZ_PATH_RECORDS } from '@/utils/menus/ustadz'
import { dayjs } from '@/utils/dayjs'
import { getUserRole } from '@/utils/supabase/get-user-role'
import { ROLE } from '@/models/auth'
import { getNextLajnahAssessment } from '@/utils/assessments'
import { Checkpoints } from '@/utils/supabase/models/checkpoints'
import { Assessments } from '@/utils/supabase/models/assessments'

interface DetailSantriProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function LajnahRole({
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
    [ACTIVITY_ID_PARAMETER]: activityIdQueryParameter
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
  const assessmentsInstance = new Assessments()
  const [
    student,
    isStudentManagedByUser,
    latestCheckpoint,
    latestSabaq,
    checkpoints,
    assessments
  ] = await Promise.all([
    studentsInstance.get(studentId),
    studentsInstance.isStudentManagedByUser(studentId),
    activitiesInstance.checkpoint({
      student_id: studentId
    }),
    activitiesInstance.getLatestSabaq({ studentId }),
    checkpointsInstance.list({ student_id: studentId }),
    assessmentsInstance.list({
      student_id: studentId,
      parent_assessment_id: null
    })
  ])

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
  const ongoingAssessment =
    assessments.data?.find((assessment) => !assessment.final_mark) || undefined
  const statusCheckpoint = checkpoints.data?.[0]
  const isLajnahAssessment =
    statusCheckpoint &&
    ['lajnah-assessment-ongoing', 'lajnah-assessment-ready'].includes(
      statusCheckpoint.status
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
          statusCheckpoint={statusCheckpoint}
          isEditable={false}
          searchParams={searchParams}
          tz={tz}
          day={day}
        />
      </div>

      {isAllowedToStartAssessment && isLajnahAssessment && (
        <AssessmentSection
          ongoingAssessment={ongoingAssessment}
          studentId={studentId}
          role={role}
          sessionRangeId={sessionRangeId}
          statusCheckpointId={statusCheckpoint?.id}
        />
      )}
    </Layout>
  )
}
