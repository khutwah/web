import { HalaqahCard } from '@/components/HalaqahCard/HalaqahCard'
import { Layout } from '@/components/Layouts/Ustadz'
import { Halaqah } from '@/utils/supabase/models/halaqah'
import { getUser } from '@/utils/supabase/get-user'
import { HeaderBackground } from '../../components/Header/Background'
import { Activities } from '@/utils/supabase/models/activities'
import { ActivityCard } from '@/components/ActivityCard/ActivityCard'
import { ActivityStatus, ActivityTypeKey } from '@/models/activities'
import Link from 'next/link'
import { ActivityPopup } from '@/components/ActivityPopup'
import { HomeHeader } from '@/components/Home/Header'
import getTimezoneInfo from '@/utils/get-timezone-info'

export default async function Home() {
  const user = await getUser()
  const userId = user.data?.id
  const tz = await getTimezoneInfo()

  const halaqah = new Halaqah()
  const halaqahList = await halaqah.list({ ustadz_id: userId })

  const activities = new Activities()
  const activityList = await activities.list({
    ustadz_id: userId,
    order_by: [['id', 'desc']],
    limit: 10
  })

  return (
    <Layout>
      <HeaderBackground />
      <ActivityPopup activities={activityList.data} />

      <div className='flex flex-col gap-y-6 mt-4 py-6'>
        <section className='px-6 gap-y-6 flex flex-col'>
          <HomeHeader displayName={user.data?.name ?? ''} ustadz />
        </section>

        <section className='flex flex-col gap-y-3 px-6'>
          {/* FIXME(dio): Add empty state component for halaqah list. */}
          {halaqahList.data.length > 0 && (
            <h2 className='text-mtmh-m-semibold'>Halaqah Hari Ini</h2>
          )}

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
          {/* FIXME(dio): Add empty state component for activity list. */}
          {activityList.data && activityList.data.length > 0 && (
            <div className='flex flex-row items-center justify-between px-6'>
              <h2 className='text-mtmh-m-semibold'>Input Terakhir</h2>
              <Link
                className='text-mtmh-sm-semibold text-mtmh-tamarind-base'
                href='/ustadz/aktivitas'
              >
                Lihat semua
              </Link>
            </div>
          )}

          <ul className='flex overflow-x-scroll gap-3 px-6 items-start'>
            {activityList.data?.map((item) => {
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
      </div>
    </Layout>
  )
}
