import { HeaderBackground } from '@/components/Header/Background'
import { Layout } from '@/components/Layouts/Santri'
import { Navbar } from '@/components/Navbar/Navbar'
import {
  ProgressChartPeriod,
  ProgressChartWithNavigation
} from '@/components/Progress/ProgressChart'
import { getUser } from '@/utils/supabase/get-user'
import { Activities } from '@/utils/supabase/models/activities'
import { Students } from '@/utils/supabase/models/students'
import dayjs from 'dayjs'

interface PencapaianProps {
  searchParams: Promise<{
    periode?: ProgressChartPeriod
  }>
}

export default async function Pencapaian({ searchParams }: PencapaianProps) {
  const { periode: periodParam } = await searchParams
  const period = periodParam === 'bulan' ? 'month' : 'week'

  const studentInstance = new Students()

  const parent = await getUser()
  const student = await studentInstance.getByParentId(parent.data!.id)

  const activitiesInstance = new Activities()
  const activities = await activitiesInstance.chart({
    student_id: student.data!.id,
    start_date: dayjs().startOf(period).toISOString(),
    end_date: dayjs().endOf(period).toISOString()
  })

  return (
    <Layout>
      <Navbar text='Pencapaian' />

      <HeaderBackground height={112} />

      <div className='p-4 pt-0'>
        <ProgressChartWithNavigation
          activities={activities}
          datePeriod={periodParam ?? 'pekan'}
        />
      </div>
    </Layout>
  )
}
