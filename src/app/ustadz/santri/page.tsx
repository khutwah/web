import { Layout } from '@/components/Layouts/Ustadz'
import { Navbar } from '@/components/Navbar/Navbar'
import { SearchSection } from '../components/Search/SearchSection'
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary'
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
import { StateMessage } from '@/components/StateMessage/StateMessage'
import { Alert, AlertDescription } from '@/components/Alert/Alert'
import { CircleAlert } from 'lucide-react'
import getTimezoneInfo from '@/utils/get-timezone-info'

export default async function Santri() {
  const user = await getUser()
  const tz = await getTimezoneInfo()
  const day = dayjs().tz(tz)

  const studentsInstance = new Students()
  const activitiesInstance = new Activities()

  const [students, activities] = await Promise.all([
    studentsInstance.list({
      ustadz_id: user.data?.id
    }),
    activitiesInstance.list({
      ustadz_id: user.data?.id,
      start_date: day.startOf('day').utc().toISOString(),
      end_date: day.endOf('day').utc().toISOString()
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
            <StateMessage
              className='my-14'
              description='Tidak dapat menampilkan data santri'
              title='Terjadi Kesalahan'
              type='error'
            />
          }
        >
          <div className='p-6 space-y-8'>
            <Alert variant='warning'>
              <CircleAlert aria-hidden size={16} />
              <AlertDescription>
                Menampilkan data untuk hari{' '}
                <label className='underline decoration-dashed'>
                  {day.format('dddd, D MMMM YYYY')}
                </label>
                .
              </AlertDescription>
            </Alert>
            <Suspense fallback={<SantriListSkeleton />}>
              <SantriList
                students={students.data}
                activities={activities.data}
                from={{ from: 'santri' }}
              />
            </Suspense>
          </div>
        </ErrorBoundary>
      </SearchProvider>
    </Layout>
  )
}
