import { Suspense } from 'react'

import { Skeleton } from '@/components/Skeleton/Skeleton'
import { StateMessage } from '@/components/StateMessage/StateMessage'
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary'
import { ActivityPopup } from '@/components/ActivityPopup'

import { ActivityStatus, ActivityTypeKey } from '@/models/activities'
import { Activities } from '@/utils/supabase/models/activities'
import { getUser } from '@/utils/supabase/get-user'
import { dayjs } from '@/utils/dayjs'
import getTimezoneInfo from '@/utils/get-timezone-info'
import { ActivityBriefCard } from '@/components/ActivityCard/ActivityBriefCard'

export function NoteListSection({ period }: { period: 'week' | 'month' }) {
  return (
    <section className='space-y-3'>
      <h2 className='text-khutwah-m-semibold'>Catatan</h2>
      <ErrorBoundary
        fallback={
          <StateMessage
            className='py-8'
            description='Tidak dapat menampilkan data aktivitas Manzil'
            title='Terjadi Kesalahan'
            type='error'
          />
        }
      >
        <Suspense fallback={<ListSkeleton />}>
          <NoteList period={period} />
        </Suspense>
      </ErrorBoundary>
    </section>
  )
}

type NoteListProps = {
  period: 'week' | 'month'
}

async function NoteList({ period }: NoteListProps) {
  const user = await getUser()

  // This gets the current day in the client's timezone.
  const tz = await getTimezoneInfo()
  const day = dayjs().tz(tz)

  const activitiesInstance = new Activities()
  const activities = await activitiesInstance.list({
    parent_id: user.id,
    start_date: day.startOf(period).toISOString(),
    end_date: day.endOf(period).toISOString(),
    status: ActivityStatus.completed,
    order_by: [['id', 'desc']]
  })

  if (activities?.data?.length === 0) {
    return (
      <StateMessage
        type='empty'
        title={`Tidak ada data catatan`}
        className='py-8'
      />
    )
  }

  return (
    <>
      <ActivityPopup activities={activities.data} />

      <ul className='space-y-3'>
        {activities.data?.map((activity) => (
          <li key={activity.id}>
            <ActivityBriefCard
              id={String(activity.id)}
              surahEnd={
                activity.student_attendance === 'present'
                  ? {
                      name: activity.end_surah ?? String(activity.end_surah),
                      verse: activity.end_verse ?? Number(activity.end_verse)
                    }
                  : null
              }
              surahStart={
                activity.student_attendance === 'present'
                  ? {
                      name:
                        activity.start_surah ?? String(activity.start_surah),
                      verse:
                        activity.start_verse ?? Number(activity.start_verse)
                    }
                  : null
              }
              timestamp={activity.created_at!}
              tz={tz}
              notes={activity.notes ?? ''}
              type={activity.type as ActivityTypeKey}
              isStudentPresent={activity.student_attendance === 'present'}
              halaqahName={activity.circle_name!}
              labels={activity.tags as Array<string>}
              status={activity.status as ActivityStatus}
            />
          </li>
        ))}
      </ul>
    </>
  )
}

function ListSkeleton() {
  return (
    <ul className='space-y-3'>
      <li>
        <Skeleton className='w-full h-36' />
      </li>
      <li>
        <Skeleton className='w-full h-36' />
      </li>
      <li>
        <Skeleton className='w-full h-36' />
      </li>
    </ul>
  )
}
