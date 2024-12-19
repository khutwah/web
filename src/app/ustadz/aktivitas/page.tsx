import { Suspense } from 'react'
import { ActivityList } from './components/ActivityList/Server'
import { Filter } from './components/Filter'
import { AktivitasPageProps } from '@/models/activity-list'

export default async function Aktivitas(props: Readonly<AktivitasPageProps>) {
  const params = await props.searchParams
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Filter studentId={params.student_id} />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <ActivityList studentId={params.student_id} />
      </Suspense>
    </div>
  )
}
