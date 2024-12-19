import { Suspense } from 'react'
import { ActivityList } from './components/ActivityList/Server'
import { Filter } from './components/Filter'

interface AktivitasProps {
  searchParams: Promise<{
    student_id?: number
  }>
}

export default async function Aktivitas(props: Readonly<AktivitasProps>) {
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
