import dayjs from '@/utils/dayjs'

import {
  ProgressChartPeriod,
  ProgressChartWithNavigation
} from '@/components/Progress/ProgressChart'

import { getUser } from '@/utils/supabase/get-user'
import { Activities } from '@/utils/supabase/models/activities'
import { Students } from '@/utils/supabase/models/students'

interface ProgressChartSectionProps {
  period: ProgressChartPeriod
}

export default async function ProgressChartSection({
  period
}: ProgressChartSectionProps) {
  const studentInstance = new Students()
  const periodPayload = period === 'bulan' ? 'month' : 'week'

  const parent = await getUser()
  const student = await studentInstance.getByParentId(parent.data!.id)

  const activitiesInstance = new Activities()
  const activities = await activitiesInstance.chart({
    student_id: student.data!.id,
    start_date: dayjs().startOf(periodPayload).toISOString(),
    end_date: dayjs().endOf(periodPayload).toISOString()
  })

  return (
    <section>
      <ProgressChartWithNavigation
        activities={activities}
        datePeriod={period}
      />
    </section>
  )
}
