import { Card, CardContent } from '@/components/Card/Card'
import { Layout } from '@/components/Layouts/Ustadz'
import { Navbar } from '@/components/Navbar/Navbar'
import { Halaqah } from '@/utils/supabase/models/halaqah'
import { navigateToHalaqahList } from './actions'
import { HalaqahDetailContent } from '@/components/Halaqah/DetailHalaqah'
import { Students } from '@/utils/supabase/models/students'
import { Activities } from '@/utils/supabase/models/activities'
import dayjs from 'dayjs'

// Dev's note: doing this instead of `?? []` because the latter creates a new reference every render.
// Not sure if it's valid in the context of server components though?
//
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DEFAULT_EMPTY_ARRAY: any[] = []

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

        <div className='bg-mtmh-primary-primary w-full p-4'>
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

        <div className='p-6'>
          <HalaqahDetailContent
            students={students.data ?? DEFAULT_EMPTY_ARRAY}
            activities={activities.data ?? DEFAULT_EMPTY_ARRAY}
          />
        </div>
      </>
    )
  }

  return <Layout>{pageContent}</Layout>
}
