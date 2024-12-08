import { Navbar } from '@/components/Navbar/Navbar'
import { XMarkIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Halaqah as HalaqahComponent } from '../../components/Halaqah'

import {
  ActivityStatus,
  ActivityType,
  ActivityTypeKey
} from '@/models/activities'
import { Activities } from '@/utils/supabase/models/activities'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/Tabs/Tabs'
import { FormPresent } from '../../components/Forms/Present'
import { MENU_PATH_RECORD } from '@/utils/menus/ustadz'
import { FormAbsent } from '../../components/Forms/Absent'
import { DEFAULT_START } from '@/models/activity-form'

interface AddActivityProps {
  params: Promise<{
    slug: number
    id: number
  }>
}

export default async function EditActivity(props: AddActivityProps) {
  const params = await props.params

  const santriPage = `${MENU_PATH_RECORD.santri}/${params.slug}`

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
  const shiftId = activity.data.shifts?.id ?? 0

  // get last completed activity
  const _activities = new Activities()
  const activities = await _activities.list({
    student_id: activity.data.student_id!,
    student_attendance: 'present',
    type: activityKey,
    order_by: 'desc',
    status: ActivityStatus.completed,
    limit: 1
  })

  const lastActivity = activities?.data?.[0]

  return (
    <div>
      <Navbar
        text='Edit Input'
        rightComponent={
          <Link replace href={santriPage}>
            <XMarkIcon />
          </Link>
        }
      />
      <HalaqahComponent
        date={activity.data.created_at!}
        studentName={activity.data.students?.name ?? ''}
        activityType={activityType}
        ustadName={activity.data.shifts?.users?.name ?? ''}
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
                achieve_target: Boolean(activity.data.achieve_target),
                page_count: activity.data.page_count ?? 0,
                target_page_count: activity.data.target_page_count,
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
                target_page_count: activity.data.target_page_count,
                created_at: activity.data.created_at!
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
