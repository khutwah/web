import { Layout } from '@/components/Layouts/Santri'
import { SantriActivityHeader } from './components/SantriActivityHeader'
import { HeaderBackground } from '@/app/ustadz/components/HeaderBackground'
import { ProgressGridWithState } from '@/components/Progress/ProgressGrid'
import { Activities } from '@/utils/supabase/models/activities'
import { getUser } from '@/utils/supabase/get-user'
import dayjs from 'dayjs'
import { Card, CardContent } from '@/components/Card/Card'

export default async function Aktivitas() {
  const parentUser = await getUser()

  const activitiesInstance = new Activities()
  const activities = await activitiesInstance.list({
    parent_id: parentUser.data?.id,
    start_date: dayjs().startOf('week').toISOString(),
    end_date: dayjs().endOf('week').toISOString()
  })

  return (
    <Layout>
      <HeaderBackground />

      <div className='p-4 text-mtmh-l-semibold text-mtmh-neutral-white'>
        Aktivitas
      </div>

      <div className='flex flex-col gap-y-4 items-center mt-4'>
        <SantriActivityHeader />

        <Card className='bg-mtmh-neutral-white text-mtmh-grey-base shadow-md border border-mtmh-snow-lighter rounded-md'>
          <CardContent className='flex flex-col p-0 gap-y-3'>
            <ProgressGridWithState
              activities={activities.data}
              className='border-none rounded-none'
              // FIXME(imballinst): remove this when we have the mechanism later.
              lajnahJuzMilestone={5}
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
