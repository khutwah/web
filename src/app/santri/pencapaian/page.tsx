import { HeaderBackground } from '@/components/Header/Background'
import { Layout } from '@/components/Layouts/Santri'
import { Navbar } from '@/components/Navbar/Navbar'
import { ProgressChart } from '@/components/Progress/ProgressChart'
import { getUser } from '@/utils/supabase/get-user'
import { Activities } from '@/utils/supabase/models/activities'
import dayjs from 'dayjs'

const DATE_CONTROLS_CONTAINER_ID = 'chart-date-period-controls'

export default async function Pencapaian() {
  const parentUser = await getUser()

  const activitiesInstance = new Activities()
  const activities = await activitiesInstance.list({
    parent_id: parentUser.data?.id,
    start_date: dayjs().startOf('week').toISOString(),
    end_date: dayjs().endOf('week').toISOString()
  })

  return (
    <Layout>
      <Navbar text='Pencapaian' />

      <HeaderBackground height={112} />

      <div id={DATE_CONTROLS_CONTAINER_ID} />

      <ProgressChart
        activities={activities?.data}
        dateControlsContainerId={DATE_CONTROLS_CONTAINER_ID}
        datePeriod='week'
        // onDatePeriodChange={() => {}}
      />
    </Layout>
  )
}
