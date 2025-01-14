import { Suspense } from 'react'
import { ActivityList } from './components/ActivityList/Server'
import { Filter } from './components/Filter/Filter'
import { AktivitasPageProps } from '@/models/activity-list'
import { Navbar } from '@/components/Navbar/Navbar'
import { ListSkeleton } from './components/Skeleton/ListSkeleton'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import { convertSearchParamsToPath } from '@/utils/url'

export default async function Aktivitas(props: Readonly<AktivitasPageProps>) {
  const params = await props.searchParams
  const returnTo = convertSearchParamsToPath({
    from: `ustadz${params.from ? `/${params.from}` : ''}`,
    id: params.id
  })
  return (
    <div className='relative'>
      <header className='sticky top-0 bg-khutwah-red-base z-10'>
        <Navbar text='Aktivitas' returnTo={returnTo} />
        <div className='p-4 pt-0 bg-khutwah-red-base'>
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
