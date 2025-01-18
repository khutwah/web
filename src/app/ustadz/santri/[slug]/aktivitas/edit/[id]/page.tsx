import { Navbar } from '@/components/Navbar/Navbar'
import { X } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Halaqah as HalaqahComponent } from '../../components/Halaqah'

import {
  ActivityStatus,
  ActivityType,
  ActivityTypeKey,
  GLOBAL_TARGET_PAGE_COUNT
} from '@/models/activities'
import { Activities } from '@/utils/supabase/models/activities'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/Tabs/Tabs'
import { FormPresent } from '../../components/Forms/Present'
import { MENU_USTADZ_PATH_RECORDS } from '@/utils/menus/ustadz'
import { FormAbsent } from '../../components/Forms/Absent'
import { DEFAULT_START } from '@/models/activity-form'
import { addQueryParams, convertSearchParamsToPath } from '@/utils/url'
import getTimezoneInfo from '@/utils/get-timezone-info'
import { Card, CardContent } from '@/components/Card/Card'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import { StateMessage } from '@/components/StateMessage/StateMessage'
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary'
import { Suspense } from 'react'

interface EditActivityProps {
  params: Promise<{
    slug: number
    id: number
  }>
  searchParams: Promise<{
    from: string
    id: string
  }>
}

export default async function EditActivity(props: EditActivityProps) {
  return (
    <ErrorBoundary fallback={<ErrorMessage />}>
      <Suspense fallback={<FallBack />}>
        <Wrapper {...props} />
      </Suspense>
    </ErrorBoundary>
  )
}

async function Wrapper(props: EditActivityProps) {
  const params = await props.params
  const searchParams = await props.searchParams
  const tz = await getTimezoneInfo()

  const santriPage = addQueryParams(
    `${MENU_USTADZ_PATH_RECORDS.santri}/${params.slug}`,
    { from: searchParams.from, id: searchParams.id }
  )

  const returnTo = `${MENU_USTADZ_PATH_RECORDS.home}${convertSearchParamsToPath(searchParams)}`

  if (!params.id) {
    return redirect(santriPage)
  }

  const _activity = new Activities()
  const activity = await _activity.get(params.id)

  if (activity.error || !activity.data) {
    return redirect(santriPage)
  }

  const activityKey: ActivityType = activity.data.type!
  const activityType = ActivityType[activityKey] as ActivityTypeKey
  const shiftId = activity.data.shift?.id ?? 0

  // get last completed activity
  const _activities = new Activities()
  const activities = await _activities.list({
    student_id: activity.data.student_id!,
    student_attendance: 'present',
    type: activityKey,
    order_by: [['id', 'desc']],
    status: ActivityStatus.completed,
    limit: 1
  })

  const lastActivity = activities?.data?.[0]

  return (
    <div>
      <Navbar
        text='Edit Input'
        returnTo={returnTo}
        rightComponent={
          <Link replace href={santriPage}>
            <X />
          </Link>
        }
      />
      <HalaqahComponent
        studentId={activity.data.student_id!}
        date={activity.data.created_at!}
        activityTargetPageCount={activity.data.target_page_count}
        tz={tz}
        studentName={activity.data.students?.name ?? ''}
        activityId={activity.data.id}
        activityType={activityType}
        ustadName={activity.data.shift?.users?.name ?? ''}
      />
      <div className='p-6 w-full'>
        <Tabs
          defaultValue={activity.data.student_attendance}
          className='w-full'
        >
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='present'>Hadir</TabsTrigger>
            <TabsTrigger value='absent'>Tidak Hadir</TabsTrigger>
          </TabsList>
          <TabsContent value='present'>
            <FormPresent
              shiftId={shiftId}
              studentId={activity.data.student_id!}
              activityType={activityKey}
              santriPageUri={santriPage}
              activityId={activity.data.id}
              defaultValues={{
                start_surah:
                  activity.data.start_surah ||
                  lastActivity?.end_surah_id ||
                  DEFAULT_START[activityKey]?.surah,
                end_surah: activity.data.end_surah || undefined,
                start_verse:
                  activity.data.start_verse ||
                  lastActivity?.end_verse ||
                  DEFAULT_START[activityKey]?.verse,
                end_verse: activity.data.end_verse || undefined,
                tags: activity.data.tags as string[] | undefined,
                notes: activity.data.notes || undefined,
                is_target_achieved: Boolean(activity.data.is_target_achieved),
                page_count: activity.data.page_count ?? 0,
                target_page_count:
                  activity.data.target_page_count || GLOBAL_TARGET_PAGE_COUNT,
                created_at: activity.data.created_at!
              }}
            />
          </TabsContent>
          <TabsContent value='absent'>
            <FormAbsent
              shiftId={shiftId}
              studentId={activity.data.student_id!}
              activityType={activityKey}
              santriPageUri={santriPage}
              activityId={activity.data.id}
              defaultValues={{
                notes: activity.data.notes!,
                target_page_count:
                  activity.data.target_page_count || GLOBAL_TARGET_PAGE_COUNT,
                created_at: activity.data.created_at!
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function FallBack() {
  return (
    <>
      <Navbar text='Tambah Input' />
      <div className='p-6 bg-khutwah-red-base'>
        <Card className='w-full bg-khutwah-neutral-white text-khutwah-grey-base'>
          <CardContent className='p-4 gap-y-3'>
            <Skeleton className='w-full h-6' />
          </CardContent>
        </Card>
      </div>
    </>
  )
}

function ErrorMessage() {
  return (
    <>
      <Navbar text='Tambah Input' />
      <div className='p-6 bg-khutwah-red-base'>
        <Card className='w-full bg-khutwah-neutral-white text-khutwah-grey-base'>
          <CardContent className='p-4 gap-y-3'>
            <StateMessage
              className='py-4'
              description='Tidak dapat menampilkan data'
              title='Terjadi Kesalahan'
              type='error'
            />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
