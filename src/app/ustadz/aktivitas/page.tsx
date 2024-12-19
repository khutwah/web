import { Suspense } from 'react'
import { ActivityList } from './components/ActivityList/Server'
import { Filter } from './components/Filter/Filter'
import { AktivitasPageProps } from '@/models/activity-list'
import { Navbar } from '@/components/Navbar/Navbar'

export default async function Aktivitas(props: Readonly<AktivitasPageProps>) {
  const params = await props.searchParams
  return (
    <div>
      <Navbar text='Aktivitas' />
      <Suspense fallback={<div>Loading...</div>}>
        <Filter />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <ActivityList studentId={params.student_id} />
      </Suspense>
    </div>
  )
}
