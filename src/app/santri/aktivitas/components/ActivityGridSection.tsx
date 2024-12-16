import dayjs from '@/utils/dayjs'
import { Suspense } from 'react'

import { SantriActivityHeader } from '@/components/SantriActivity/Header'
import { Card, CardContent } from '@/components/Card/Card'
import {
  ProgressGridSkeleton,
  ProgressGridWithState
} from '@/components/Progress/ProgressGrid'
import { StateMessage } from '@/components/StateMessage/StateMessage'
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary'

import { Activities } from '@/utils/supabase/models/activities'
import { getUser } from '@/utils/supabase/get-user'
import getTimezoneInfo from '@/utils/get-timezone-info'
export async function ActivityGridSection() {
  return (
    <section className='flex flex-col gap-y-4'>
      <div className='flex justify-center gap-x-[6.5px] text-mtmh-neutral-white text-mtmh-m-regular'>
        <SantriActivityHeader />
      </div>

      <Card className='bg-mtmh-neutral-white text-mtmh-grey-base shadow-md border border-mtmh-snow-lighter rounded-md'>
        <CardContent className='flex flex-col p-0 gap-y-3'>
          <ErrorBoundary
            fallback={
              <StateMessage
                className='py-8 px-4'
                description='Tidak dapat menampilkan data progres aktivitas'
                title='Terjadi Kesalahan'
                type='error'
              />
            }
          >
            <Suspense fallback={<ProgressGridSkeleton />}>
              <ActivityGrid />
            </Suspense>
          </ErrorBoundary>
        </CardContent>
      </Card>
    </section>
  )
}

async function ActivityGrid() {
  const user = await getUser()
  // This gets the current day in the client's timezone.
  const tz = await getTimezoneInfo()
  const day = dayjs().tz(tz)

  const activitiesInstance = new Activities()
  const activities = await activitiesInstance.list({
    parent_id: user.data?.id,
    start_date: day.startOf('week').toISOString(),
    end_date: day.endOf('week').toISOString()
  })

  return (
    <ProgressGridWithState
      activities={activities.data}
      className='border-none rounded-none'
    />
  )
}
