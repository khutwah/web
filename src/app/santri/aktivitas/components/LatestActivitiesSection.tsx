import { Info } from 'lucide-react'
import { Suspense } from 'react'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/Tabs/Tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/Alert/Alert'
import { ActivityCard } from '@/components/ActivityCard/ActivityCard'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import { StateMessage } from '@/components/StateMessage/StateMessage'

import {
  ActivityStatus,
  ActivityType,
  ActivityTypeKey
} from '@/models/activities'
import { Activities } from '@/utils/supabase/models/activities'
import { getUser } from '@/utils/supabase/get-user'

export function LatestActivitiesSection() {
  return (
    <section className='space-y-3'>
      <h2 className='text-mtmh-m-semibold'>Aktivitas Terakhir</h2>
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
                Sabaq adalah proses menambahkan hafalan baru yang harus
                disetorkan setiap hari oleh siswa Tahfizhul Qur’an
              </AlertDescription>
            </div>
          </Alert>
          <Suspense fallback={<ListSkeleton />}>
            <LatestActivitiesByType type={ActivityType.Sabaq} />
          </Suspense>
        </TabsContent>
        <TabsContent value='sabqi' className='space-y-3'>
          <Alert className='items-start' variant='info'>
            <Info className='flex-shrink-0' width='16' height='16' />
            <div>
              <AlertTitle>Apa itu sabqi?</AlertTitle>
              <AlertDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Tempore, aut dolor hic sapiente doloremque libero, aperiam rem
                delectus dignissimos quo quod unde adipisci consectetur, ipsum
                perferendis incidunt eveniet voluptatibus asperiores.
              </AlertDescription>
            </div>
          </Alert>

          <Suspense fallback={<ListSkeleton />}>
            <LatestActivitiesByType type={ActivityType.Sabqi} />
          </Suspense>
        </TabsContent>
        <TabsContent value='manzil' className='space-y-3'>
          <Alert className='items-start' variant='info'>
            <Info className='flex-shrink-0' width='16' height='16' />
            <div>
              <AlertTitle>Apa itu manzil?</AlertTitle>
              <AlertDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Tempore, aut dolor hic sapiente doloremque libero, aperiam rem
                delectus dignissimos quo quod unde adipisci consectetur, ipsum
                perferendis incidunt eveniet voluptatibus asperiores.
              </AlertDescription>
            </div>
          </Alert>

          <Suspense fallback={<ListSkeleton />}>
            <LatestActivitiesByType type={ActivityType.Manzil} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </section>
  )
}

async function LatestActivitiesByType({ type }: { type: ActivityType }) {
  const user = await getUser()

  const activitiesInstance = new Activities()

  const activities = await activitiesInstance.list({
    parent_id: user.data?.id,
    type,
    limit: 10,
    order_by: 'asc'
  })

  console.log(activities)

  if (activities?.data?.length === 0) {
    return <StateMessage type='empty' title='Tidak ada data aktivitas' />
  }

  return (
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
