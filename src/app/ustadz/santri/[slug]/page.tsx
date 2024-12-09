import { Card, CardContent, CardHeader } from '@/components/Card/Card'
import { AddActivityCta } from '@/components/AddActivityCta/AddActivityCta'
import { Layout } from '@/components/Layouts/Ustadz'
import { Navbar } from '@/components/Navbar/Navbar'
import { navigateToSantriList } from './actions'
import { Students } from '@/utils/supabase/models/students'
import { Activities } from '@/utils/supabase/models/activities'
import dayjs from 'dayjs'
import Image from 'next/image'
import SampleSantriAvatar from '@/assets/sample-ustadz-photo.png'
import { ProgressGridWithState } from '@/components/Progress/ProgressGrid'

export default async function DetailSantri({
  params: paramsPromise
}: {
  params: Promise<{ slug: string }>
}) {
  const params = await paramsPromise

  const studentsInstance = new Students()
  const student = await studentsInstance.get(Number(params.slug))
  const halaqahId = String(student.data?.halaqah?.id)
  const studentId = params.slug

  let pageContent: JSX.Element

  if (!student.data) {
    pageContent = <div>Unexpected error: {student.error?.message}</div>
  } else {
    const activitiesInstance = new Activities()
    const activities = await activitiesInstance.list({
      student_id: student.data.id,
      start_date: dayjs().startOf('week').toISOString(),
      end_date: dayjs().endOf('week').toISOString(),
      limit: 21
    })

    const currentDatetime = dayjs()

    pageContent = (
      <>
        <Navbar
          text='Detil Santri'
          // FIXME(imballinst): this doesn't go back to the previous path.
          // Kinda wanted to use something like router.back() but it requires to have 'use client',
          // and since this is server client, it's not possible. So, let's just go to halaqah list for now.
          onClickBackButton={navigateToSantriList}
          rightComponent={<NotesIcon className='fill-mtmh-neutral-white' />}
        />

        <div className='bg-mtmh-red-base w-full p-4 h-[225px] absolute -z-10' />

        <div className='flex flex-col p-6 gap-y-4'>
          <div className='flex justify-center gap-x-[6.5px] text-mtmh-neutral-white text-mtmh-m-regular'>
            {/* FIXME(imballinst): convert Gregorian calendar to Hijri calendar. */}
            <div>10 Jumadil Ula 1446 H</div>

            <div>•</div>

            <time dateTime={currentDatetime.format('YYYY-MM-DD')}>
              {currentDatetime.format('DD MMMM YYYY')}
            </time>
          </div>

          <Card className='bg-mtmh-neutral-white text-mtmh-grey-base shadow-md border border-mtmh-snow-lighter rounded-md'>
            <CardHeader className='flex flex-row justify-between items-center border-b border-b-mtmh-snow-lighter'>
              <div>
                <div className='text-mtmh-l-semibold text-mtmh-grey-base'>
                  {student.data.name}
                </div>
                <div className='text-mtmh-m-regular text-mtmh-grey-lighter'>
                  {student.data.halaqah?.name}
                </div>
              </div>

              <Image
                src={SampleSantriAvatar}
                alt=''
                width={52}
                height={52}
                className='rounded-full'
              />
            </CardHeader>
            <CardContent className='flex flex-col p-0 gap-y-3'>
              <ProgressGridWithState
                activities={activities.data}
                className='border-none rounded-none'
              />
            </CardContent>
          </Card>
        </div>

        <section className='mx-6 mb-8'>
          <h2 className='text-mtmh-grey-base mb-3 font-semibold text-sm'>
            Tambah Input
          </h2>
          <div className='flex gap-1.5'>
            <AddActivityCta
              activityType='Sabaq'
              className='w-full'
              halaqahId={halaqahId}
              size='sm'
              studentId={studentId}
            />
            <AddActivityCta
              activityType='Sabqi'
              className='w-full'
              halaqahId={halaqahId}
              size='sm'
              studentId={studentId}
            />
            <AddActivityCta
              activityType='Manzil'
              className='w-full'
              halaqahId={halaqahId}
              size='sm'
              studentId={studentId}
            />
          </div>
        </section>

        <div className='p-6'>
          {/* <HalaqahDetailContent
            students={students.data ?? DEFAULT_EMPTY_ARRAY}
            activities={activities.data ?? DEFAULT_EMPTY_ARRAY}
          /> */}
        </div>
      </>
    )
  }

  return <Layout>{pageContent}</Layout>
}

function NotesIcon(props: { className: string }) {
  return (
    <svg
      width='20'
      height='19'
      viewBox='0 0 20 19'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path d='M3 16V17.9998C3 18.7771 3.84848 19.2569 4.515 18.857L9.277 16H14C15.103 16 16 15.103 16 14V6C16 4.897 15.103 4 14 4H2C0.897 4 0 4.897 0 6V14C0 15.103 0.897 16 2 16H3ZM2 6H14V14H8.723L5 16.234V14H2V6Z' />
      <path d='M18 0H6C4.897 0 4 0.897 4 2H16C17.103 2 18 2.897 18 4V12C19.103 12 20 11.103 20 10V2C20 0.897 19.103 0 18 0Z' />
    </svg>
  )
}
