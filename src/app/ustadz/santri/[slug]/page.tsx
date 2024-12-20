import { Card, CardContent, CardHeader } from '@/components/Card/Card'
import { AddActivityCta } from '@/components/AddActivityCta/AddActivityCta'
import { Layout } from '@/components/Layouts/Ustadz'
import { Navbar } from '@/components/Navbar/Navbar'
import { Students } from '@/utils/supabase/models/students'
import { Activities } from '@/utils/supabase/models/activities'
import dayjs from '@/utils/dayjs'
import Image from 'next/image'
import SampleSantriAvatar from '@/assets/sample-santri-photo.png'
import { ProgressGridWithNav } from '@/components/Progress/ProgressGrid'
import { SantriActivityHeader } from '@/components/SantriActivity/Header'
import { ActivityPopup } from '@/components/ActivityPopup'
import { ActivityCard } from '@/components/ActivityCard/ActivityCard'
import Link from 'next/link'
import {
  ACTIVITY_PERIOD_QUERY_PARAMETER,
  ACTIVITY_CURRENT_DATE_QUERY_PARAMETER,
  ACTIVITY_CURRENT_DATE_QUERY_PARAMETER_DATE_FORMAT,
  ACTIVITY_VIEW_QUERY_PARAMETER,
  ActivityStatus,
  ActivityTypeKey
} from '@/models/activities'
import { Checkpoint } from '@/utils/supabase/models/checkpoint'
import { CheckpointStatus } from '@/models/checkpoint'
import { parseParameter } from '@/utils/parse-parameter'
import getTimezoneInfo from '@/utils/get-timezone-info'
import { MENU_USTADZ_PATH_RECORDS } from '@/utils/menus/ustadz'
import { cn } from '@/utils/classnames'

import {
  convertSearchParamsToPath,
  convertSearchParamsToStringRecords
} from '@/utils/url'
import { ProgressChartWithNavigation } from '@/components/Progress/ProgressChart'
import {
  ProgressToggle,
  ProgressToggleProps
} from './components/ProgressToggle/ProgressToggle'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DEFAULT_EMPTY_ARRAY: any[] = []

export default async function DetailSantri({
  params: paramsPromise,
  searchParams: searchParamsPromise
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await paramsPromise
  const searchParams = await searchParamsPromise

  // Exclude <ActivityCard> related props, because they are irrelevant inside the Add/Edit Activity view.
  // `periodQueryParameter` is of type `ProgressChartPeriod`.
  const {
    [ACTIVITY_CURRENT_DATE_QUERY_PARAMETER]: currentDateQueryParameter,
    [ACTIVITY_PERIOD_QUERY_PARAMETER]: periodQueryParameter,
    ...searchStringRecords
  } = convertSearchParamsToStringRecords(searchParams)

  const studentId = params.slug
  const studentsInstance = new Students()
  const student = await studentsInstance.get(Number(studentId))
  const halaqahId = String(student.data?.halaqah?.id)
  const chartPeriod = searchParams['periode'] === 'bulan' ? 'month' : 'week'
  const isChartView = searchParams[ACTIVITY_VIEW_QUERY_PARAMETER] === 'chart'

  let pageContent: JSX.Element

  if (!student.data) {
    pageContent = <div>Unexpected error: {student.error?.message}</div>
  } else {
    // This gets the current day in the client's timezone.
    const tz = await getTimezoneInfo()
    const period = periodQueryParameter === 'bulan' ? 'month' : 'week'

    const day = dayjs
      .utc(
        currentDateQueryParameter,
        ACTIVITY_CURRENT_DATE_QUERY_PARAMETER_DATE_FORMAT
      )
      .tz(tz)
    const activitiesInstance = new Activities()
    const [
      activitiesPromise,
      lastActivitiesPromise,
      latestCheckpointPromise,
      isUserManageStudentPromise,
      checkpointPromise,
      activitiesChartPromise
    ] = await Promise.allSettled([
      activitiesInstance.list({
        student_id: student.data.id,
        start_date: day.startOf(period).toISOString(),
        end_date: day.endOf(period).toISOString(),
        limit: 21
      }),
      activitiesInstance.list({
        student_id: student.data.id,
        order_by: [['id', 'desc']],
        limit: 10
      }),
      activitiesInstance.checkpoint({
        student_id: student.data.id
      }),
      studentsInstance.isUserManagesStudent(Number(studentId)),
      new Checkpoint().list({
        student_id: Number(studentId)
      }),
      activitiesInstance.chart({
        student_id: student.data!.id,
        start_date: day.startOf(chartPeriod).toISOString(),
        end_date: day.endOf(chartPeriod).toISOString(),
        tz
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

    const activitiesChart =
      activitiesChartPromise.status === 'fulfilled'
        ? activitiesChartPromise.value
        : DEFAULT_EMPTY_ARRAY

    const returnTo = convertSearchParamsToPath(searchParams)
    pageContent = (
      <>
        <ActivityPopup
          activities={lastActivities?.data ?? DEFAULT_EMPTY_ARRAY}
        />
        <Navbar
          text='Detail Santri'
          rightComponent={
            <ProgressToggle
              initialView={
                searchParams[
                  ACTIVITY_VIEW_QUERY_PARAMETER
                ] as ProgressToggleProps['initialView']
              }
            />
          }
          returnTo={`${MENU_USTADZ_PATH_RECORDS.home}${returnTo}`}
        />

        <div className='bg-mtmh-red-base w-full p-4 h-[225px] absolute -z-10' />

        <div className='flex flex-col p-6 gap-y-4'>
          <div className='flex justify-center gap-x-[6.5px] text-mtmh-neutral-white text-mtmh-m-regular'>
            <SantriActivityHeader hasJumpToTodayLink={!isChartView} />
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
            <CardContent
              className={cn(
                'flex flex-col p-0 gap-y-3 transition-all duration-200 ease-in-out',
                {
                  'p-4 pb-0': isChartView
                }
              )}
            >
              {isChartView ? (
                <ProgressChartWithNavigation
                  activities={activitiesChart}
                  datePeriod={
                    periodQueryParameter === 'bulan' ? 'bulan' : 'pekan'
                  }
                />
              ) : (
                <ProgressGridWithNav
                  activities={activities?.data ?? DEFAULT_EMPTY_ARRAY}
                  date={day.toDate()}
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
              )}
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
                searchParams={searchStringRecords}
              />
              <AddActivityCta
                activityType='Sabqi'
                className='w-full'
                halaqahId={halaqahId}
                size='sm'
                studentId={studentId}
                searchParams={searchStringRecords}
              />
              <AddActivityCta
                activityType='Manzil'
                className='w-full'
                halaqahId={halaqahId}
                size='sm'
                studentId={studentId}
                searchParams={searchStringRecords}
              />
            </div>
          </section>
        ) : null}

        <section className='flex flex-col gap-3 mb-8'>
          {/* FIXME(dio): Add empty state component for last activities. */}
          {lastActivities?.data && lastActivities?.data.length > 0 && (
            <div className='flex flex-row items-center justify-between px-6'>
              <h2 className='text-mtmh-m-semibold'>Input Terakhir</h2>
              <Link
                className='text-mtmh-sm-semibold text-mtmh-tamarind-base'
                href={`/ustadz/aktivitas?student_id=${student.data.id}`}
              >
                Lihat semua
              </Link>
            </div>
          )}

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
                    tz={tz}
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
