import { Info } from 'lucide-react'
import { Suspense } from 'react'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/Tabs/Tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/Alert/Alert'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import { StateMessage } from '@/components/StateMessage/StateMessage'
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary'

import {
  ActivityStatus,
  ActivityType,
  ActivityTypeKey
} from '@/models/activities'
import { Activities } from '@/utils/supabase/models/activities'
import { getUser } from '@/utils/supabase/get-user'
import getTimezoneInfo from '@/utils/get-timezone-info'
import { ActivityBriefCard } from '@/components/ActivityCard/ActivityBriefCard'

export function LatestActivitiesSection() {
  return (
    <section className='space-y-3'>
      <h2 className='text-khutwah-m-semibold'>Aktivitas Terakhir</h2>
      <Tabs defaultValue='sabaq' className='w-full space-y-3'>
        <TabsList className='flex w-full'>
          <TabsTrigger
            value='sabaq'
            className='flex-grow flex-shrink min-w-0 w-full'
          >
            Sabaq
          </TabsTrigger>
          <TabsTrigger
            value='sabqi'
            className='flex-grow flex-shrink min-w-0 w-full'
          >
            Sabqi
          </TabsTrigger>
          <TabsTrigger
            value='manzil'
            className='flex-grow flex-shrink min-w-0 w-full'
          >
            Manzil
          </TabsTrigger>
        </TabsList>
        <TabsContent value='sabaq' className='space-y-3'>
          <Alert className='items-start' variant='info'>
            <Info className='flex-shrink-0' width='16' height='16' />
            <div>
              <AlertTitle>Apa itu sabaq?</AlertTitle>
              <AlertDescription>
                Sabaq merujuk pada hafalan baru yang belum pernah dihafal
                sebelumnya. Ini adalah bagian dari Al-Qur&apos;an yang
                dipelajari dan dihafalkan untuk pertama kalinya. Pada kegiatan
                ini, santri berusaha menghafal ayat-ayat baru dengan benar
                sesuai dengan target yang sudah ditentukan.
              </AlertDescription>
            </div>
          </Alert>
          <ErrorBoundary
            fallback={
              <StateMessage
                className='py-8'
                description='Tidak dapat menampilkan data aktivitas Sabaq'
                title='Terjadi Kesalahan'
                type='error'
              />
            }
          >
            <Suspense fallback={<ListSkeleton />}>
              <LatestActivitiesByType type={ActivityType.Sabaq} />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>
        <TabsContent value='sabqi' className='space-y-3'>
          <Alert className='items-start' variant='info'>
            <Info className='flex-shrink-0' width='16' height='16' />
            <div>
              <AlertTitle>Apa itu sabqi?</AlertTitle>
              <AlertDescription>
                Sabqi adalah muraja&apos;ah (pengulangan) dari hafalan yang
                telah dihafal sebelumnya dalam kegiatan Sabaq. Biasanya, ini
                mencakup hafalan yang masih relatif baru sehingga perlu
                diperkuat. Fokus santri adalah penguatan hafalan baru agar lebih
                mantap dan tidak mudah lupa.
              </AlertDescription>
            </div>
          </Alert>
          <ErrorBoundary
            fallback={
              <StateMessage
                className='py-8'
                description='Tidak dapat menampilkan data aktivitas Sabqi'
                title='Terjadi Kesalahan'
                type='error'
              />
            }
          >
            <Suspense fallback={<ListSkeleton />}>
              <LatestActivitiesByType type={ActivityType.Sabqi} />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>
        <TabsContent value='manzil' className='space-y-3'>
          <Alert className='items-start' variant='info'>
            <Info className='flex-shrink-0' width='16' height='16' />
            <div>
              <AlertTitle>Apa itu manzil?</AlertTitle>
              <AlertDescription>
                Manzil adalah muraja&apos;ah hafalan yang sudah jauh dari masa
                pertama kali dihafal. Biasanya mencakup hafalan yang lebih
                besar, seperti satu juz atau beberapa juz. Fokus santri adalah
                menjaga hafalan jangka panjang agar tidak hilang dan tetap
                lancar.
              </AlertDescription>
            </div>
          </Alert>
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
              <LatestActivitiesByType type={ActivityType.Manzil} />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>
      </Tabs>
    </section>
  )
}

const TYPE_TO_LABEL_MAP = {
  [ActivityType.Sabaq]: 'Sabaq',
  [ActivityType.Sabqi]: 'Sabqi',
  [ActivityType.Manzil]: 'Manzil'
}

async function LatestActivitiesByType({ type }: { type: ActivityType }) {
  const user = await getUser()
  const tz = await getTimezoneInfo()

  const activitiesInstance = new Activities()

  const activities = await activitiesInstance.list({
    parent_id: user.id,
    type,
    limit: 10,
    order_by: [['id', 'desc']],
    status: ActivityStatus.completed
  })

  if (activities?.data?.length === 0) {
    return (
      <StateMessage
        type='empty'
        title={`Belum ada data aktivitas ${TYPE_TO_LABEL_MAP[type]}`}
        className='py-8'
      />
    )
  }

  return (
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
                    name: activity.start_surah ?? String(activity.start_surah),
                    verse: activity.start_verse ?? Number(activity.start_verse)
                  }
                : null
            }
            timestamp={activity.created_at!}
            tz={tz}
            notes={activity.notes ?? ''}
            type={activity.type as ActivityTypeKey}
            attendance={activity.student_attendance as 'present' | 'absent'}
            halaqahName={activity.circle_name!}
            labels={activity.tags as Array<string>}
            status={activity.status as ActivityStatus}
          />
        </li>
      ))}
    </ul>
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
