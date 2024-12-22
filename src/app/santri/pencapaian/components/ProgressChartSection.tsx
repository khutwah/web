import dayjs from '@/utils/dayjs'

import {
  ProgressChartPeriod,
  ProgressChartWithNavigation
} from '@/components/Progress/ProgressChart'

import { getUser } from '@/utils/supabase/get-user'
import { Activities } from '@/utils/supabase/models/activities'
import { Students } from '@/utils/supabase/models/students'
import getTimezoneInfo from '@/utils/get-timezone-info'

interface ProgressChartSectionProps {
  period: ProgressChartPeriod
}

export default async function ProgressChartSection({
  period
}: ProgressChartSectionProps) {
  const tz = await getTimezoneInfo()
  const day = dayjs().tz(tz)
  const studentInstance = new Students()
  const parent = await getUser()
  const student = await studentInstance.getByParentId(parent.data!.id)

  const activitiesInstance = new Activities()
  const activities = await activitiesInstance.chart({
    student_id: student.data!.id,
    start_date: day.startOf(period).toISOString(),
    end_date: day.endOf(period).toISOString(),
    tz
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
