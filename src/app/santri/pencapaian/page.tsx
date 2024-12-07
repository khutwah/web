import { HeaderBackground } from '@/components/Header/Background'
import { Layout } from '@/components/Layouts/Santri'
import { Navbar } from '@/components/Navbar/Navbar'
import {
  ProgressChartPeriod,
  ProgressChartWithNavigation
} from '@/components/Progress/ProgressChart'
import { ActivityType } from '@/models/activities'
import dayjsGmt7 from '@/utils/dayjs-gmt7'
import { getUser } from '@/utils/supabase/get-user'
import { Activities } from '@/utils/supabase/models/activities'
import dayjs from 'dayjs'

interface PencapaianProps {
  searchParams: Promise<{
    periode?: ProgressChartPeriod
  }>
}

export default async function Pencapaian({ searchParams }: PencapaianProps) {
  const { periode: periodParam } = await searchParams
  const period = periodParam === 'bulan' ? 'month' : 'week'

  const parentUser = await getUser()

  const activitiesInstance = new Activities()
  const activities = await activitiesInstance.list({
    parent_id: parentUser.data?.id,
    start_date: dayjs().startOf(period).toISOString(),
    end_date: dayjs().endOf(period).toISOString(),
    type: ActivityType.Sabaq,
    limit: period === 'week' ? 7 : dayjsGmt7().daysInMonth()
  })

  return (
    <Layout>
      <Navbar text='Pencapaian' />

      <HeaderBackground height={112} />

      <div className='p-4 pt-0'>
        <ProgressChartWithNavigation
          activities={activities?.data}
          datePeriod={periodParam ?? 'pekan'}
        />
      </div>
    </Layout>
  )
}
