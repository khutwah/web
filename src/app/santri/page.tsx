import { Layout } from '@/components/Layouts/Santri'
import { HeaderBackground } from '@/components/Header/Background'
import { HomeHeader } from '@/components/Home/Header'
import { getUser } from '@/utils/supabase/get-user'
import { StatsCard } from '@/components/StatsCard/StatsCard'
import { Activities } from '@/utils/supabase/models/activities'
import { ActivityStatus, ActivityType } from '@/models/activities'

export default async function Home() {
  const user = await getUser()

  const activitiesInstance = new Activities()
  const [activities, halaqahCount] = await Promise.all([
    activitiesInstance.list({
      parent_id: user.data?.id,
      type: ActivityType.Sabaq,
      limit: 1,
      order_by: [['id', 'desc']],
      status: ActivityStatus.completed,
      student_attendance: 'present'
    }),
    // TODO(dio-khutwah): Build a proper query for this.
    activitiesInstance.count({
      parent_id: user.data?.id,
      type: ActivityType.Sabaq,
      limit: Number.MAX_SAFE_INTEGER,
      status: ActivityStatus.completed,
      student_attendance: 'present'
    })
  ])
  const latestActivity = activities.data?.at(0)

  return (
    <Layout>
      <HeaderBackground />
      <div className='flex flex-col gap-y-6 mt-4 py-6'>
        <section className='px-6 gap-y-6 flex flex-col'>
          <HomeHeader displayName={user.data?.name ?? ''} />
        </section>
        <section className='flex flex-col gap-y-3 px-6'>
          <StatsCard
            surah={latestActivity?.start_surah_id || 0}
            ayah={latestActivity?.start_verse || 0}
            halaqahCount={halaqahCount || 0}
          />
        </section>
      </div>
    </Layout>
  )
}
