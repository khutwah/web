import { Layout } from '@/components/Layout/Ustadz'
import { Navbar } from '@/components/Navbar/Navbar'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import { Suspense } from 'react'
import SearchProvider from '../components/Search/SearchProvider'
import { SearchSection } from '../components/Search/SearchSection'
import { YourHalaqahList } from './components/YourHalaqahList'
import { AllHalaqahList } from './components/AllHalaqahList'
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary'
import { StateMessage } from '@/components/StateMessage/StateMessage'
import { Alert, AlertDescription } from '@/components/Alert/Alert'
import { CircleAlert } from 'lucide-react'
import getTimezoneInfo from '@/utils/get-timezone-info'
import dayjs from '@/utils/dayjs'
import { MENU_USTADZ_PATH_RECORDS } from '@/utils/menus/ustadz'

export default async function HalaqahListPage() {
  const tz = await getTimezoneInfo()
  const day = dayjs().tz(tz)
  return (
    <Layout>
      <SearchProvider>
        <header className='sticky top-0 bg-mtmh-red-base'>
          <Navbar text='Halaqah' returnTo={MENU_USTADZ_PATH_RECORDS.home} />
          <SearchSection
            id='search-halaqah'
            name='search-halaqah'
            placeholder='Cari halaqah...'
          />
        </header>

        <ErrorBoundary
          fallback={
            <StateMessage
              className='my-14'
              description='Tidak dapat menampilkan data halaqah'
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
            <section>
              <h2 className='mb-3 text-mtmh-m-semibold'>Halaqah Antum</h2>
              <Suspense fallback={<HalaqahListSkeleton />}>
                <YourHalaqahList />
              </Suspense>
            </section>

            <section>
              <h2 className='mb-3 text-mtmh-m-semibold'>Semua Halaqah</h2>
              <Suspense fallback={<HalaqahListSkeleton />}>
                <AllHalaqahList />
              </Suspense>
            </section>
          </div>
        </ErrorBoundary>
      </SearchProvider>
    </Layout>
  )
}

function HalaqahListSkeleton() {
  return (
    <div className='space-y-3'>
      <Skeleton className='w-full h-16' />
      <Skeleton className='w-full h-16' />
      <Skeleton className='w-full h-16' />
    </div>
  )
}
