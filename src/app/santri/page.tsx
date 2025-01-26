import { Layout } from '@/components/Layout/Santri'
import { HeaderBackground } from '@/components/Header/Background'
import { HomeHeader } from '@/components/Home/Header'
import { getUser } from '@/utils/supabase/get-user'
import { StatsCard } from '@/components/StatsCard/StatsCard'
import { Activities } from '@/utils/supabase/models/activities'
import { ActivityStatus, ActivityType } from '@/models/activities'
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary'
import { Suspense } from 'react'
import { StateMessage } from '@/components/StateMessage/StateMessage'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import { Students } from '@/utils/supabase/models/students'
import { Assessments } from '@/utils/supabase/models/assessments'
import Link from 'next/link'
import { Button } from '@/components/Button/Button'
import { LogIn } from 'lucide-react'
import { MENU_SANTRI_PATH_RECORDS } from '@/utils/menus/santri'
import LastAssessmentsSection from './components/LastAssessmentsSection'
import getTimezoneInfo from '@/utils/get-timezone-info'

export default async function Home() {
  return (
    <Layout>
      <HeaderBackground />
      <ErrorBoundary fallback={<ErrorMessage />}>
        <Suspense fallback={<Fallback />}>
          <Wrapper />
        </Suspense>
      </ErrorBoundary>
    </Layout>
  )
}

async function Wrapper() {
  const user = await getUser()
  const studentsInstance = new Students()
  const assessmentInstance = new Assessments()
  const tz = await getTimezoneInfo()

  // FIXME(dio): When user is not found, redirect to login page.
  const activitiesInstance = new Activities()
  const [lastSabaq, halaqahCount, student] = await Promise.all([
    activitiesInstance.getLatestSabaq({ parentId: user.id }),
    activitiesInstance.count({
      parent_id: user.id,
      type: ActivityType.Sabaq,
      status: ActivityStatus.completed,
      student_attendance: 'present'
    }),
    studentsInstance.getByParentId(user.id)
  ])

  const assessments = await assessmentInstance.list({
    student_id: student.data?.id,
    parent_assessment_id: null
  })

  const ongoingAssessment =
    assessments.data?.find((assessment) => !assessment.final_mark) || undefined

  return (
    <>
      <div className='flex flex-col gap-y-6 mt-4 py-6'>
        <section className='px-6 gap-y-6 flex flex-col'>
          <HomeHeader displayName={user.name ?? ''} />
        </section>
        {ongoingAssessment && (
          <section className='flex flex-col gap-y-3 px-6'>
            <h2 className='text-khutwah-m-semibold'>Sedang Berlangsung</h2>
            <Link
              href={`${MENU_SANTRI_PATH_RECORDS.home}/aktivitas/asesmen/${ongoingAssessment.id}`}
            >
              <Button variant='primary' className='w-full'>
                <LogIn size={16} />
                Ikhtibar {ongoingAssessment.session_name}
              </Button>
            </Link>
          </section>
        )}
        <section className='flex flex-col gap-y-3 px-6'>
          <StatsCard
            surah={lastSabaq?.end_surah || 0}
            ayah={lastSabaq?.end_verse || 0}
            halaqahCount={halaqahCount || 0}
          />
        </section>
        <LastAssessmentsSection
          studentId={student.data?.id?.toString() ?? ''}
          searchParams={{}}
          tz={tz}
        />
      </div>
    </>
  )
}

function Fallback() {
  return (
    <div className='flex flex-col gap-y-6 mt-4 py-6'>
      <section className='px-6 gap-y-6 flex flex-col'>
        <HomeHeader displayName={'...'} ustadz isLoading />
      </section>
      <section className='flex flex-col gap-y-3 px-6'>
        <Skeleton className='w-full h-64' />
      </section>
    </div>
  )
}

function ErrorMessage() {
  return (
    <div className='flex flex-col gap-y-6 mt-4 py-6'>
      <section className='px-6 gap-y-6 flex flex-col'>
        <HomeHeader displayName={'...'} isLoading />
      </section>
      <section className='flex flex-col gap-y-3 px-6'>
        <StateMessage
          description='Tidak dapat menampilkan data'
          title='Terjadi Kesalahan'
          type='error'
        />
      </section>
    </div>
  )
}
