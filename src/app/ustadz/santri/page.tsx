import { Layout } from '@/components/Layouts/Ustadz'
import { Navbar } from '@/components/Navbar/Navbar'
import { SearchSection } from '../components/Search/SearchSection'
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary'
import { ErrorState } from '@/components/ErrorState/ErrorState'
import { Suspense } from 'react'
import {
  SantriList,
  SantriListSkeleton
} from '../components/SantriList/SantriList'
import { Students } from '@/utils/supabase/models/students'
import { getUser } from '@/utils/supabase/get-user'
import { Activities } from '@/utils/supabase/models/activities'
import { dayjs } from '@/utils/dayjs'
import SearchProvider from '../components/Search/SearchProvider'

export default async function Santri() {
  const user = await getUser()

  const studentsInstance = new Students()
  const activitiesInstance = new Activities()

  const [students, activities] = await Promise.all([
    studentsInstance.list({
      ustadz_id: user.data?.id
    }),
    activitiesInstance.list({
      ustadz_id: user.data?.id,
      start_date: dayjs().startOf('day').toISOString(),
      end_date: dayjs().endOf('day').toISOString()
    })
  ])

  return (
    <Layout>
      <SearchProvider>
        <header className='sticky top-0 bg-mtmh-red-base'>
          <Navbar text='Santri' />
          <SearchSection
            id='search-santri'
            name='search-santri'
            placeholder='Cari santri...'
          />
        </header>

        <ErrorBoundary
          fallback={
            <ErrorState
              className='my-14'
              description='Tidak dapat menampilkan data santri'
              title='Terjadi Kesalahan'
            />
          }
        >
          <div className='p-6 space-y-8'>
            <Suspense fallback={<SantriListSkeleton />}>
              <SantriList
                students={students.data}
                activities={activities.data}
              />
            </Suspense>
          </div>
        </ErrorBoundary>
      </SearchProvider>
    </Layout>
  )
}
