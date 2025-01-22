import { ActivityCard } from '@/components/ActivityCard/ActivityCard'
import { ActivityPopup } from '@/components/ActivityPopup'
import { ActivityStatus, ActivityTypeKey } from '@/models/activities'
import { MENU_USTADZ_PATH_RECORDS } from '@/utils/menus/ustadz'
import { Activities } from '@/utils/supabase/models/activities'
import { addQueryParams } from '@/utils/url'
import Link from 'next/link'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DEFAULT_EMPTY_ARRAY: any[] = []

interface LastActivitiesSectionProps {
  studentId: string
  searchParams: { [key: string]: string | string[] | undefined }
  tz: string
  isEditable: boolean
}

export default async function LastActivitiesSection({
  studentId,
  searchParams,
  tz,
  isEditable
}: LastActivitiesSectionProps) {
  const activitiesInstance = new Activities()
  const lastActivities = await activitiesInstance.list({
    student_id: Number(studentId),
    order_by: [['id', 'desc']],
    limit: 10
  })

  return (
    <>
      {lastActivities.data && lastActivities.data?.length > 0 && (
        <section className='flex flex-col gap-3 mb-8'>
          <ActivityPopup
            isEditable={isEditable}
            activities={lastActivities?.data ?? DEFAULT_EMPTY_ARRAY}
          />
          <div className='flex flex-row items-center justify-between px-6'>
            <h2 className='text-khutwah-m-semibold'>Input Terakhir</h2>
            <Link
              className='text-khutwah-sm-semibold text-khutwah-tamarind-base'
              href={addQueryParams(
                `${MENU_USTADZ_PATH_RECORDS.home}/aktivitas`,
                {
                  from: 'santri',
                  id: addQueryParams(studentId, searchParams),
                  student_id: studentId
                }
              )}
            >
              Lihat semua
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
                            name: item.end_surah ?? String(item.end_surah),
                            verse: item.end_verse ?? Number(item.end_verse)
                          }
                        : null
                    }
                    surahStart={
                      item.student_attendance === 'present'
                        ? {
                            name: item.start_surah ?? String(item.start_surah),
                            verse: item.start_verse ?? Number(item.start_verse)
                          }
                        : null
                    }
                    timestamp={item.created_at!}
                    tz={tz}
                    notes={item.notes ?? ''}
                    type={item.type as ActivityTypeKey}
                    attendance={item.student_attendance as 'present' | 'absent'}
                    studentName={item.student_name!}
                    halaqahName={item.circle_name!}
                    labels={tags}
                    status={item.status as ActivityStatus}
                  />
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </>
  )
}
