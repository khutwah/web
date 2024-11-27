import { Card, CardContent } from '@/components/Card/Card'
import { Layout } from '@/components/Layouts/Ustadz'
import { Navbar } from '@/components/Navbar/Navbar'
import { Halaqah } from '@/utils/supabase/models/halaqah'
import { navigateToHalaqahList } from './actions'

export default async function DetailHalaqah({
  params: paramsPromise
}: {
  params: Promise<{ slug: string }>
}) {
  const params = await paramsPromise

  const halaqah = new Halaqah()
  const halaqahInfo = await halaqah.get(Number(params.slug))
  let pageContent

  if (!halaqahInfo?.data) {
    pageContent = <div>Unexpected error: {halaqahInfo?.error.message}</div>
  } else {
    pageContent = (
      <>
        <Navbar
          text={halaqahInfo.data.name ?? ''}
          onClickBackButton={navigateToHalaqahList}
        />

        <div className='bg-mtmh-primary-primary w-full p-4'>
          <Card className='bg-mtmh-neutral-white text-mtmh-grey-base shadow-md'>
            <CardContent className='flex flex-col p-4 gap-y-3'>
              <dl>
                <dt>Wali halaqah</dt>
                <dd>{halaqahInfo.data.ustadz?.name}</dd>

                <dt>Lokasi</dt>
                <dd>{halaqahInfo.data.location}</dd>
              </dl>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  return <Layout>{pageContent}</Layout>
}
