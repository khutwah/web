import { Navbar } from '@/components/Navbar/Navbar'
import { XMarkIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Halaqah as HalaqahComponent } from '../../components/Halaqah'

import { Halaqah } from '@/utils/supabase/models/halaqah'
import { ActivityTypeKey } from '@/models/activities'
import { Students } from '@/utils/supabase/models/students'
import { Activities } from '@/utils/supabase/models/activities'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/Tabs/Tabs'
import { FormPresence } from '../../components/Forms/Presence'

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

  const santriPage = `/ustadz/santri/${params.slug}`

  if (!searchParams.activity_type || !searchParams.halaqah_id) {
    return redirect(santriPage)
  }

  const _halaqah = new Halaqah()
  const halaqah = await _halaqah.get(searchParams.halaqah_id)

  const _student = new Students()
  const student = await _student.get(params.slug)

  const _activities = new Activities()
  const activities = await _activities.list({ student_id: params.slug })

  const lastActivity = activities?.data?.[(activities?.data?.length ?? 0) - 1]

  return (
    <div>
      <Navbar
        text='Tambah Input'
        rightComponent={
          <Link replace href={santriPage}>
            <XMarkIcon />
          </Link>
        }
      />
      <HalaqahComponent
        date={new Date().toISOString()}
        studentName={student.data?.name ?? ''}
        activityType={searchParams.activity_type}
        ustadName={halaqah?.data?.ustadz?.name ?? ''}
        lastSurah={
          lastActivity
            ? `${lastActivity?.end_surah} : ${lastActivity?.end_verse}`
            : ''
        }
      />
      <div className='p-6 w-full'>
        <Tabs defaultValue='presence' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='presence'>Hadir</TabsTrigger>
            <TabsTrigger value='absence'>Tidak Hadir</TabsTrigger>
          </TabsList>
          <TabsContent value='presence'>
            <FormPresence />
          </TabsContent>
          <TabsContent value='absence'>Tidak Hadir</TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
