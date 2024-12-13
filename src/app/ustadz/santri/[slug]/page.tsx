import { Card, CardContent, CardHeader } from '@/components/Card/Card'
import { AddActivityCta } from '@/components/AddActivityCta/AddActivityCta'
import { Layout } from '@/components/Layouts/Ustadz'
import { Navbar } from '@/components/Navbar/Navbar'
import { navigateToSantriList } from './actions'
import { Students } from '@/utils/supabase/models/students'
import { Activities } from '@/utils/supabase/models/activities'
import dayjs from '@/utils/dayjs'
import Image from 'next/image'
import SampleSantriAvatar from '@/assets/sample-ustadz-photo.png'
import { ProgressGridWithState } from '@/components/Progress/ProgressGrid'
import { SantriActivityHeader } from '@/components/SantriActivity/Header'
import { ActivityPopup } from '@/components/ActivityPopup'
import { ActivityCard } from '@/components/ActivityCard/ActivityCard'
import Link from 'next/link'
import { ActivityStatus, ActivityTypeKey } from '@/models/activities'
import { Checkpoint } from '@/utils/supabase/models/checkpoint'
import { CheckpointStatus } from '@/models/checkpoint'
import { parseParameter } from '@/utils/parse-parameter'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DEFAULT_EMPTY_ARRAY: any[] = []

export default async function DetailSantri({
  params: paramsPromise
}: {
  params: Promise<{ slug: string }>
}) {
  const params = await paramsPromise

  const studentId = params.slug
  const studentsInstance = new Students()
  const student = await studentsInstance.get(Number(studentId))
  const halaqahId = String(student.data?.halaqah?.id)

  let pageContent: JSX.Element

  if (!student.data) {
    pageContent = <div>Unexpected error: {student.error?.message}</div>
  } else {
    const activitiesInstance = new Activities()
    const [
      activitiesPromise,
      lastActivitiesPromise,
      latestCheckpointPromise,
      isUserManageStudentPromise,
      checkpointPromise
    ] = await Promise.allSettled([
      activitiesInstance.list({
        student_id: student.data.id,
        start_date: dayjs().startOf('week').toISOString(),
        end_date: dayjs().endOf('week').toISOString(),
        limit: 21
      }),
      activitiesInstance.list({
        student_id: student.data.id,
        order_by: 'desc',
        limit: 10
      }),
      activitiesInstance.checkpoint({
        student_id: student.data.id
      }),
      studentsInstance.isUserManagesStudent(Number(studentId)),
      new Checkpoint().list({
        student_id: Number(studentId)
      })
    ])

    const activities =
      activitiesPromise.status === 'fulfilled'
        ? activitiesPromise.value
        : undefined

    const checkpointData =
      checkpointPromise.status === 'fulfilled'
        ? checkpointPromise.value.data?.[0]
        : undefined

    const lastActivities =
      lastActivitiesPromise.status === 'fulfilled'
        ? lastActivitiesPromise.value
        : undefined

    const isUserManageStudent =
      isUserManageStudentPromise.status === 'fulfilled'
        ? isUserManageStudentPromise.value
        : undefined

    const latestCheckpoint =
      latestCheckpointPromise.status === 'fulfilled'
        ? latestCheckpointPromise.value
        : undefined

    pageContent = (
      <>
        <ActivityPopup
          activities={lastActivities?.data ?? DEFAULT_EMPTY_ARRAY}
        />
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
            <SantriActivityHeader />
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
                activities={activities?.data ?? DEFAULT_EMPTY_ARRAY}
                className='border-none rounded-none'
                statusProps={{
                  editable: isUserManageStudent,
                  status: checkpointData?.status as CheckpointStatus,
                  parameter: parseParameter(checkpointData),
                  checkpointId: checkpointData?.id,
                  lastActivityId: latestCheckpoint?.last_activity_id,
                  pageCountAccumulation:
                    latestCheckpoint?.page_count_accumulation,
                  studentId: Number(studentId),
                  notes: latestCheckpoint?.notes,
                  partCount: latestCheckpoint?.part_count
                }}
              />
            </CardContent>
          </Card>
        </div>

        {isUserManageStudent && latestCheckpoint?.status !== 'inactive' ? (
          <section className='mx-6 mb-6'>
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
        ) : null}

        <section className='flex flex-col gap-3 mb-8'>
          <div className='flex flex-row items-center justify-between px-6'>
            <h2 className='text-mtmh-m-semibold'>Input Terakhir</h2>
            <Link
              className='text-mtmh-sm-semibold text-mtmh-tamarind-base'
              href={`/ustadz/aktivitas?student_id=${student.data.id}`}
            >
              Lihat inputan
            </Link>
          </div>

          <ul className='flex overflow-x-scroll gap-3 px-6 items-start'>
            {lastActivities?.data?.map((item) => {
              const tags = item.tags as string[]
              return (
                <li key={item.id} className='w-[300px] flex-shrink-0 h-full'>
                  <ActivityCard
                    id={String(item.id)}
                    surahEnd={
                      item.student_attendance === 'present'
                        ? {
                            name: String(item.end_surah),
                            verse: String(item.end_verse)
                          }
                        : null
                    }
                    surahStart={
                      item.student_attendance === 'present'
                        ? {
                            name: String(item.start_surah),
                            verse: String(item.start_verse)
                          }
                        : null
                    }
                    timestamp={item.created_at!}
                    notes={item.notes ?? ''}
                    type={item.type as ActivityTypeKey}
                    isStudentPresent={item.student_attendance === 'present'}
                    studentName={item.student_name!}
                    halaqahName={item.halaqah_name!}
                    labels={tags}
                    status={item.status as ActivityStatus}
                  />
                </li>
              )
            })}
          </ul>
        </section>
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
