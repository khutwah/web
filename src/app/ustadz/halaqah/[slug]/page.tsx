import { Card, CardContent } from '@/components/Card/Card'
import { Layout } from '@/components/Layouts/Ustadz'
import { Navbar } from '@/components/Navbar/Navbar'
import { Halaqah } from '@/utils/supabase/models/halaqah'
import { navigateToHalaqahList } from './actions'
import { SantriList } from '@/app/ustadz/components/SantriList/SantriList'
import { Students } from '@/utils/supabase/models/students'
import { Activities } from '@/utils/supabase/models/activities'
import dayjs from 'dayjs'
import SearchProvider from '../../components/Search/SearchProvider'
import { SearchSection } from '../../components/Search/SearchSection'

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
    const students = await studentsInstance.list({
      halaqah_ids: [halaqahInfo.data.id]
    })

    const activitiesInstance = new Activities()
    const activities = await activitiesInstance.list({
      halaqah_ids: [halaqahInfo.data.id],
      start_date: dayjs().startOf('day').toISOString(),
      end_date: dayjs().endOf('day').toISOString()
    })

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

            <SantriList students={students.data} activities={activities.data} />
          </SearchProvider>
        </div>
      </>
    )
  }

  return <Layout>{pageContent}</Layout>
}
