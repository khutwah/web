import { HalaqahCard } from '@/components/HalaqahCard/HalaqahCard'
import { Layout } from '@/components/Layouts/Ustadz'
import { Halaqah } from '@/utils/supabase/models/halaqah'
import { getUser } from '@/utils/supabase/get-user'
import { UstadzHomeHeader } from './components/UstadzHomeHeader'
import { HeaderBackground } from '../../components/Header/Background'
import { Activities } from '@/utils/supabase/models/activities'
import { ActivityCard } from '@/components/ActivityCard/ActivityCard'
import { ActivityStatus, ActivityTypeKey } from '@/models/activities'
import Link from 'next/link'
import { ActivityPopup } from '@/components/ActivityPopup'

export default async function Home() {
  const user = await getUser()

  const halaqah = new Halaqah()
  const halaqahList = await halaqah.list({ ustadz_id: user.data?.id })

  const activities = new Activities()
  const activityList = await activities.list({
    ustadz_id: user.data?.id,
    order_by: 'desc',
    limit: 4
  })

  return (
    <Layout>
      <HeaderBackground />
      <ActivityPopup activities={activityList.data} />

      <div className='flex flex-col gap-y-6 mt-4 py-6'>
        <section className='px-6 gap-y-6 flex flex-col'>
          <UstadzHomeHeader displayName={user.data?.name ?? ''} />
        </section>

        <section className='flex flex-col gap-y-3 px-6'>
          <h2 className='text-mtmh-m-semibold'>Halaqah Hari Ini</h2>

          {halaqahList?.kind === 'ustadz' && (
            <ul className='flex flex-col gap-y-3'>
              {halaqahList.data.map((item) => {
                const defaultShift = item.shifts.find(
                  (shift) => shift.end_date === null
                )
                const replacementShift = item.shifts.find(
                  (shift) => shift.end_date !== null
                )
                const effectiveShift = replacementShift ?? defaultShift

                const substituteeName = replacementShift?.user.name ?? undefined

                const isOwner = defaultShift?.user.id === user.data?.id

                return (
                  <li key={item.id}>
                    <HalaqahCard
                      id={item.id}
                      name={item.name!}
                      venue={effectiveShift?.location ?? ''}
                      substituteeName={
                        substituteeName &&
                        (isOwner
                          ? substituteeName
                          : defaultShift?.user.name || '')
                      }
                      isOwner={isOwner}
                      hasGutter
                    />
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section className='flex flex-col gap-3'>
          <div className='flex flex-row items-center justify-between px-6'>
            <h2 className='text-mtmh-m-semibold'>Input Terakhir</h2>
            <Link
              className='text-mtmh-sm-semibold text-mtmh-tamarind-base'
              href='/ustadz/aktivitas'
            >
              Lihat semua
            </Link>
          </div>

          <ul className='flex overflow-x-scroll gap-3 px-6 items-start'>
            {activityList.data?.map((item) => {
              const tags = item.tags as string[]
              return (
                <li key={item.id} className='w-[300px] flex-shrink-0'>
                  <ActivityCard
                    id={String(item.id)}
                    surahEnd={{
                      name: String(item.end_surah),
                      verse: String(item.end_verse)
                    }}
                    surahStart={{
                      name: String(item.start_surah),
                      verse: String(item.start_verse)
                    }}
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
      </div>
    </Layout>
  )
}
