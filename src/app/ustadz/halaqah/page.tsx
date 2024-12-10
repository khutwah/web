import { Layout } from '@/components/Layouts/Ustadz'
import { Navbar } from '@/components/Navbar/Navbar'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import { Suspense } from 'react'
import SearchProvider from './components/SearchProvider'
import { SearchSection } from './components/SearchSection'
import { YourHalaqahList } from './components/YourHalaqahList'
import { AllHalaqahList } from './components/AllHalaqahList'
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary'
import { ErrorState } from '@/components/ErrorState/ErrorState'

export default function HalaqahListPage() {
  return (
    <Layout>
      <SearchProvider>
        <header className='sticky top-0'>
          <Navbar text='Halaqah' />
          <SearchSection />
        </header>

        <ErrorBoundary
          fallback={
            <ErrorState
              className='my-14'
              description='Tidak dapat menampilkan data halaqah'
              title='Terjadi Kesalahan'
            />
          }
        >
          <div className='p-6 space-y-8'>
            <section>
              <h2 className='mb-3 text-mtmh-m-semibold'>Halaqah Anda</h2>
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
