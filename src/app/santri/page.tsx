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

  // FIXME(dio): When user is not found, redirect to login page.
  const activitiesInstance = new Activities()
  const [lastSabaq, halaqahCount] = await Promise.all([
    activitiesInstance.getLatestSabaq({ parentId: user.id }),
    activitiesInstance.count({
      parent_id: user.id,
      type: ActivityType.Sabaq,
      status: ActivityStatus.completed,
      student_attendance: 'present'
    })
  ])

  return (
    <>
      <div className='flex flex-col gap-y-6 mt-4 py-6'>
        <section className='px-6 gap-y-6 flex flex-col'>
          <HomeHeader displayName={user.name ?? ''} />
        </section>
        <section className='flex flex-col gap-y-3 px-6'>
          <StatsCard
            surah={lastSabaq?.end_surah || 0}
            ayah={lastSabaq?.end_verse || 0}
            halaqahCount={halaqahCount || 0}
          />
        </section>
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
