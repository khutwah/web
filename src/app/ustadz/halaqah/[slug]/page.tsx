import { Card, CardContent } from '@/components/Card/Card'
import { Layout } from '@/components/Layout/Ustadz'
import { Navbar } from '@/components/Navbar/Navbar'
import { Circles } from '@/utils/supabase/models/circles'
import { SantriList } from '@/app/ustadz/components/SantriList/SantriList'
import { Students } from '@/utils/supabase/models/students'
import { Activities } from '@/utils/supabase/models/activities'
import SearchProvider from '../../components/Search/SearchProvider'
import { SearchSection } from '../../components/Search/SearchSection'
import getTimezoneInfo from '@/utils/get-timezone-info'
import dayjs from '@/utils/dayjs'
import { Alert, AlertDescription } from '@/components/Alert/Alert'
import { CircleAlert } from 'lucide-react'
import { MENU_USTADZ_PATH_RECORDS } from '@/utils/menus/ustadz'
import { convertSearchParamsToPath } from '@/utils/url'

export default async function DetailHalaqah({
  params: paramsPromise,
  searchParams: searchParamsPromise
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await paramsPromise
  const searchParams = await searchParamsPromise

  const circlesInstance = new Circles()
  const circleInfo = await circlesInstance.get(Number(params.slug))
  let pageContent: JSX.Element

  if (!circleInfo?.data) {
    // TODO: implement proper error handling.
    pageContent = <div>Unexpected error: {circleInfo?.error.message}</div>
  } else {
    const studentsInstance = new Students()
    const activitiesInstance = new Activities()

    // This gets the current day in the client's timezone.
    const tz = await getTimezoneInfo()
    const day = dayjs().tz(tz)

    const [students, activities] = await Promise.all([
      studentsInstance.list({
        circle_ids: [circleInfo.data.id]
      }),
      activitiesInstance.list({
        circle_ids: [circleInfo.data.id],
        // So this means, startOf and endOf the day in the client's timezone.
        // Then we convert it to UTC, before formatting it to ISO string.
        start_date: day.startOf('day').utc().toISOString(),
        end_date: day.endOf('day').utc().toISOString()
      })
    ])

    const returnTo = convertSearchParamsToPath(searchParams)
    pageContent = (
      <>
        <Navbar
          text={circleInfo.data.name ?? ''}
          returnTo={`${MENU_USTADZ_PATH_RECORDS.home}${returnTo}`}
        />

        <div className='bg-mtmh-red-base w-full p-4'>
          <Card className='bg-mtmh-neutral-white text-mtmh-grey-base shadow-md'>
            <CardContent className='flex flex-col p-4 gap-y-3'>
              <dl className='grid grid-cols-3 text-mtmh-m-regular gap-y-2'>
                <dt className='font-semibold col-span-1'>Wali halaqah</dt>
                <dd className='col-span-2'>{circleInfo.data.ustadz?.name}</dd>

                <dt className='font-semibold col-span-1'>Lokasi</dt>
                <dd className='col-span-2'>{circleInfo.data.location}</dd>
              </dl>
            </CardContent>
          </Card>
        </div>

        <div className='p-6 space-y-6'>
          <SearchProvider>
            <SearchSection
              color='white'
              id='search-santri'
              name='search-santri'
              placeholder='Cari santri...'
            />
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
            <SantriList
              students={
                students.data?.map(({ id, name }) => ({
                  id,
                  name: name || ''
                })) || []
              }
              activities={activities.data}
              from={{ from: 'halaqah', id: circleInfo.data.id }}
            />
          </SearchProvider>
        </div>
      </>
    )
  }

  return <Layout>{pageContent}</Layout>
}
