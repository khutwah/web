import { Navbar } from '@/components/Navbar/Navbar'
import { X } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Halaqah as HalaqahComponent } from '../components/Halaqah'

import { Circles } from '@/utils/supabase/models/circles'
import {
  ActivityStatus,
  ActivityType,
  ActivityTypeKey
} from '@/models/activities'
import { Students } from '@/utils/supabase/models/students'
import { Activities } from '@/utils/supabase/models/activities'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/Tabs/Tabs'
import { FormPresent } from '../components/Forms/Present'
import { MENU_USTADZ_PATH_RECORDS } from '@/utils/menus/ustadz'
import { FormAbsent } from '../components/Forms/Absent'
import { Checkpoints } from '@/utils/supabase/models/checkpoints'
import { TAG_LAJNAH_ASSESSMENT_ONGOING } from '@/models/checkpoints'
import { addQueryParams } from '@/utils/url'
import getTimezoneInfo from '@/utils/get-timezone-info'

interface AddActivityProps {
  params: Promise<{
    slug: number
  }>
  searchParams: Promise<{
    activity_type: ActivityTypeKey
    halaqah_id: number
    from: string
    id: string
  }>
}

export default async function AddActivity(props: AddActivityProps) {
  const params = await props.params
  const searchParams = await props.searchParams
  const tz = await getTimezoneInfo()

  const santriPage = addQueryParams(
    `${MENU_USTADZ_PATH_RECORDS.santri}/${params.slug}`,
    { from: searchParams.from, id: searchParams.id }
  )

  if (!searchParams.activity_type || !searchParams.halaqah_id) {
    return redirect(santriPage)
  }

  const activityType = searchParams.activity_type as ActivityTypeKey
  const activityKey = ActivityType[activityType]

  const circlesInstance = new Circles()
  const studentsInstance = new Students()
  const activitiesInstance = new Activities()

  const [circleInfo, studentInfo, activities] = await Promise.all([
    circlesInstance.get(searchParams.halaqah_id),
    studentsInstance.get(params.slug),
    activitiesInstance.list({
      student_id: Number(params.slug),
      student_attendance: 'present',
      type: activityType === 'Sabqi' ? ActivityType.Sabaq : activityKey,
      order_by: [['id', 'desc']],
      status: ActivityStatus.completed,
      limit: 1
    })
  ])

  const lastActivity = activities?.data?.[0]

  const checkpointInstance = new Checkpoints()
  const activeCheckpoint = await checkpointInstance.list({
    status: [
      'lajnah-assessment-approaching',
      'lajnah-assessment-ready',
      'lajnah-assessment-ongoing'
    ]
  })
  const isCheckpointExist = Boolean(activeCheckpoint?.data?.length)

  const optionalProps = {
    ...(lastActivity && {
      lastSurah: lastActivity.end_surah_id!,
      lastVerse: lastActivity.end_verse!
    })
  }

  const defaultValues = {
    ...(isCheckpointExist && {
      tags: [TAG_LAJNAH_ASSESSMENT_ONGOING]
    })
  }

  return (
    <div>
      <Navbar
        text='Tambah Input'
        rightComponent={
          <Link replace href={santriPage}>
            <X />
          </Link>
        }
      />
      <HalaqahComponent
        date={new Date().toISOString()}
        tz={tz}
        studentName={studentInfo.data?.name ?? ''}
        activityType={activityType}
        ustadName={circleInfo?.data?.ustadz?.name ?? ''}
        lastSurah={
          lastActivity
            ? `${lastActivity?.end_surah}: ${lastActivity?.end_verse}`
            : ''
        }
      />
      <div className='p-6 w-full'>
        <Tabs defaultValue='present' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='present'>Hadir</TabsTrigger>
            <TabsTrigger value='absent'>Tidak Hadir</TabsTrigger>
          </TabsList>
          <TabsContent value='present'>
            <FormPresent
              shiftId={circleInfo?.data?.ustadz?.shiftId ?? 0}
              studentId={params.slug}
              activityType={activityKey}
              santriPageUri={santriPage}
              defaultValues={defaultValues}
              {...optionalProps}
            />
          </TabsContent>
          <TabsContent value='absent'>
            <FormAbsent
              shiftId={circleInfo?.data?.ustadz?.shiftId ?? 0}
              studentId={params.slug}
              activityType={activityKey}
              santriPageUri={santriPage}
              defaultValues={defaultValues}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
