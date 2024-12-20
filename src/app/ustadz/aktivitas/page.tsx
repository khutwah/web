import { Suspense } from 'react'
import { ActivityList } from './components/ActivityList/Server'
import { Filter } from './components/Filter/Filter'
import { AktivitasPageProps } from '@/models/activity-list'
import { Navbar } from '@/components/Navbar/Navbar'
import { ListSkeleton } from './components/Skeleton/ListSkeleton'
import { Skeleton } from '@/components/Skeleton/Skeleton'

export default async function Aktivitas(props: Readonly<AktivitasPageProps>) {
  const params = await props.searchParams
  return (
    <div className='relative overflow-auto'>
      <header className='sticky top-0 bg-mtmh-red-base z-10'>
        <Navbar text='Aktivitas' />
        <div className='p-4 pt-0 bg-mtmh-red-base'>
          <Suspense fallback={<Skeleton className='h-10 w-full' />}>
            <Filter />
          </Suspense>
        </div>
      </header>
      <main>
        <Suspense fallback={<ListSkeleton />}>
          <ActivityList studentId={params.student_id} />
        </Suspense>
      </main>
    </div>
  )
}
