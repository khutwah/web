import { Suspense } from 'react'

import { ActivityCard } from '@/components/ActivityCard/ActivityCard'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import { StateMessage } from '@/components/StateMessage/StateMessage'
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary'
import { ActivityPopup } from '@/components/ActivityPopup'

import { ActivityStatus, ActivityTypeKey } from '@/models/activities'
import { Activities } from '@/utils/supabase/models/activities'
import { getUser } from '@/utils/supabase/get-user'
import { dayjs } from '@/utils/dayjs'
import getTimezoneInfo from '@/utils/get-timezone-info'

export function NoteListSection({ period }: { period: 'week' | 'month' }) {
  return (
    <section className='space-y-3'>
      <h2 className='text-mtmh-m-semibold'>Catatan</h2>
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
    parent_id: user.data!.id,
    start_date: day.startOf(period).toISOString(),
    end_date: day.endOf(period).toISOString(),
    status: ActivityStatus.completed
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
            <ActivityCard
              id={String(activity.id)}
              surahEnd={
                activity.student_attendance === 'present'
                  ? {
                      name: String(activity.end_surah),
                      verse: String(activity.end_verse)
                    }
                  : null
              }
              surahStart={
                activity.student_attendance === 'present'
                  ? {
                      name: String(activity.start_surah),
                      verse: String(activity.start_verse)
                    }
                  : null
              }
              timestamp={activity.created_at!}
              notes={activity.notes ?? ''}
              type={activity.type as ActivityTypeKey}
              isStudentPresent={activity.student_attendance === 'present'}
              studentName={activity.student_name!}
              halaqahName={activity.halaqah_name!}
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
        <Skeleton className='w-full h-56'></Skeleton>
      </li>
      <li>
        <Skeleton className='w-full h-56'></Skeleton>
      </li>
      <li>
        <Skeleton className='w-full h-56'></Skeleton>
      </li>
    </ul>
  )
}
