import { Suspense } from 'react'
import { CircleAlert } from 'lucide-react'

import { Alert, AlertDescription } from '@/components/Alert/Alert'
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary'
import { Layout } from '@/components/Layout/Ustadz'
import { Navbar } from '@/components/Navbar/Navbar'
import { StateMessage } from '@/components/StateMessage/StateMessage'
import { SearchSection } from '@/app/ustadz/components/Search/SearchSection'
import SearchProvider from '@/app/ustadz/components/Search/SearchProvider'
import { SantriListSkeleton } from '@/app/ustadz/components/SantriList/SantriList'
import { SantriListWrapper } from '@/app/ustadz/components/SantriList/SantriListWrapper'
import { FilterDrawer } from '@/app/ustadz/santri/components/FilterDrawer'

import { dayjs } from '@/utils/dayjs'
import getTimezoneInfo from '@/utils/get-timezone-info'
import { MENU_USTADZ_PATH_RECORDS } from '@/utils/menus/ustadz'
import { parseSearchParams } from '@/utils/url'
import { CheckpointStatus } from '@/models/checkpoints'
import {
  CHECKPOINT_STATUS_SEARCH_PARAMS_KEY,
  USTADZ_ID_SEARCH_PARAMS_KEY
} from '@/app/ustadz/santri/constants'
import { getUser } from '@/utils/supabase/get-user'
import { ReloadButton } from './components/ReloadButton'

export default async function Santri({
  searchParams: searchParamsPromise
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const tz = await getTimezoneInfo()
  const day = dayjs().tz(tz)

  const currentUser = await getUser()

  const searchParams = await searchParamsPromise
  const parsedSearchParams = parseSearchParams(searchParams, {
    [USTADZ_ID_SEARCH_PARAMS_KEY]: 'string',
    [CHECKPOINT_STATUS_SEARCH_PARAMS_KEY]: 'array'
  } as const)

  const checkpointStatuses = parsedSearchParams[
    CHECKPOINT_STATUS_SEARCH_PARAMS_KEY
  ] as Array<CheckpointStatus>
  const ustadzId =
    parsedSearchParams[USTADZ_ID_SEARCH_PARAMS_KEY] || currentUser.id || 'ALL'

  return (
    <Layout>
      <SearchProvider>
        <header className='sticky top-0 bg-khutwah-red-base'>
          <Navbar text='Santri' returnTo={MENU_USTADZ_PATH_RECORDS.home} />
          <SearchSection
            id='search-santri'
            name='search-santri'
            placeholder='Cari santri...'
            trailingComponent={
              <FilterDrawer
                ustadzId={ustadzId === 'ALL' ? 'ALL' : Number(ustadzId)}
                checkpointStatuses={checkpointStatuses}
              />
            }
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
              <SantriListWrapper
                from={{ from: 'santri' }}
                checkpointStatuses={
                  (parsedSearchParams[
                    CHECKPOINT_STATUS_SEARCH_PARAMS_KEY
                  ] as CheckpointStatus[]) || undefined
                }
                ustadzId={ustadzId === 'ALL' ? undefined : Number(ustadzId)}
                emptyState={
                  <StateMessage
                    className='py-8'
                    type='empty'
                    title='Tidak Menemukan Data Santri'
                    description='Silakan periksa kembali pencarian dan filter. Atau coba muat ulang halaman.'
                    actionButton={<ReloadButton />}
                  />
                }
              />
            </Suspense>
          </div>
        </ErrorBoundary>
      </SearchProvider>
    </Layout>
  )
}
