import { Card, CardContent } from '@/components/Card/Card'
import { Layout } from '@/components/Layouts/Ustadz'
import { Navbar } from '@/components/Navbar/Navbar'
import { Halaqah } from '@/utils/supabase/models/halaqah'
import { navigateToHalaqahList } from './actions'
import { SantriList } from '@/app/ustadz/components/SantriList/SantriList'
import { Students } from '@/utils/supabase/models/students'
import { Activities } from '@/utils/supabase/models/activities'
import SearchProvider from '../../components/Search/SearchProvider'
import { SearchSection } from '../../components/Search/SearchSection'
import getTimezoneInfo from '@/utils/get-timezone-info'
import dayjs from '@/utils/dayjs'
import { Alert, AlertDescription } from '@/components/Alert/Alert'
import { CircleAlert } from 'lucide-react'

export default async function DetailHalaqah({
  params: paramsPromise
}: {
  params: Promise<{ slug: string }>
}) {
  const params = await paramsPromise

  const halaqah = new Halaqah()
  const halaqahInfo = await halaqah.get(Number(params.slug))
  let pageContent: JSX.Element

  if (!halaqahInfo?.data) {
    // TODO: implement proper error handling.
    pageContent = <div>Unexpected error: {halaqahInfo?.error.message}</div>
  } else {
    const studentsInstance = new Students()
    const activitiesInstance = new Activities()

    // This gets the current day in the client's timezone.
    const tz = await getTimezoneInfo()
    const day = dayjs().tz(tz)

    const [students, activities] = await Promise.all([
      studentsInstance.list({
        halaqah_ids: [halaqahInfo.data.id]
      }),
      activitiesInstance.list({
        halaqah_ids: [halaqahInfo.data.id],
        // So this means, startOf and endOf the day in the client's timezone.
        // Then we convert it to UTC, before formatting it to ISO string.
        start_date: day.startOf('day').utc().toISOString(),
        end_date: day.endOf('day').utc().toISOString()
      })
    ])
    pageContent = (
      <>
        <Navbar
          text={halaqahInfo.data.name ?? ''}
          // FIXME(imballinst): this doesn't go back to the previous path.
          // Kinda wanted to use something like router.back() but it requires to have 'use client',
          // and since this is server client, it's not possible. So, let's just go to halaqah list for now.
          onClickBackButton={navigateToHalaqahList}
        />

        <div className='bg-mtmh-red-base w-full p-4'>
          <Card className='bg-mtmh-neutral-white text-mtmh-grey-base shadow-md'>
            <CardContent className='flex flex-col p-4 gap-y-3'>
              <dl className='grid grid-cols-3 text-mtmh-m-regular gap-y-2'>
                <dt className='font-semibold col-span-1'>Wali halaqah</dt>
                <dd className='col-span-2'>{halaqahInfo.data.ustadz?.name}</dd>

                <dt className='font-semibold col-span-1'>Lokasi</dt>
                <dd className='col-span-2'>{halaqahInfo.data.location}</dd>
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
                Menampilkan data untuk hari {day.format('dddd, D MMMM YYYY')}.
              </AlertDescription>
            </Alert>
            <SantriList students={students.data} activities={activities.data} />
          </SearchProvider>
        </div>
      </>
    )
  }

  return <Layout>{pageContent}</Layout>
}
