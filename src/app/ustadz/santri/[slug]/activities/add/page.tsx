import { Navbar } from '@/components/Navbar/Navbar'
import { X } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Halaqah as HalaqahComponent } from '../components/Halaqah'

import { Halaqah } from '@/utils/supabase/models/halaqah'
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
import { Checkpoint } from '@/utils/supabase/models/checkpoint'
import { TAG_DURING_LAJNAH } from '@/models/checkpoint'

interface AddActivityProps {
  params: Promise<{
    slug: number
  }>
  searchParams: Promise<{
    activity_type: ActivityTypeKey
    halaqah_id: number
  }>
}

export default async function AddActivity(props: AddActivityProps) {
  const params = await props.params
  const searchParams = await props.searchParams

  const santriPage = `${MENU_USTADZ_PATH_RECORDS.santri}/${params.slug}`

  if (!searchParams.activity_type || !searchParams.halaqah_id) {
    return redirect(santriPage)
  }

  const activityType = searchParams.activity_type as ActivityTypeKey
  const activityKey = ActivityType[activityType]

  const _halaqah = new Halaqah()
  const halaqah = await _halaqah.get(searchParams.halaqah_id)

  const _student = new Students()
  const student = await _student.get(params.slug)

  const _activities = new Activities()
  const activities = await _activities.list({
    student_id: Number(params.slug),
    student_attendance: 'present',
    type: activityKey,
    order_by: 'desc',
    status: ActivityStatus.completed,
    limit: 1
  })

  const lastActivity = activities?.data?.[0]

  const checkpointInstance = new Checkpoint()
  const activeCheckpoint = await checkpointInstance.list({
    status: ['lajnah-approaching', 'lajnah-exam', 'lajnah-ready']
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
      tags: [TAG_DURING_LAJNAH]
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
        studentName={student.data?.name ?? ''}
        activityType={activityType}
        ustadName={halaqah?.data?.ustadz?.name ?? ''}
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
              shiftId={halaqah?.data?.ustadz?.shiftId ?? 0}
              studentId={params.slug}
              activityType={activityKey}
              santriPageUri={santriPage}
              defaultValues={defaultValues}
              {...optionalProps}
            />
          </TabsContent>
          <TabsContent value='absent'>
            <FormAbsent
              shiftId={halaqah?.data?.ustadz?.shiftId ?? 0}
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
