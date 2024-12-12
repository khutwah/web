import dayjs from '@/utils/dayjs'
import { Suspense } from 'react'

import { SantriActivityHeader } from '@/components/SantriActivity/Header'
import { Card, CardContent } from '@/components/Card/Card'
import {
  ProgressGridSkeleton,
  ProgressGridWithState
} from '@/components/Progress/ProgressGrid'

import { Activities } from '@/utils/supabase/models/activities'
import { getUser } from '@/utils/supabase/get-user'

export async function ActivityGridSection() {
  return (
    <section className='flex flex-col gap-y-4'>
      <div className='flex justify-center gap-x-[6.5px] text-mtmh-neutral-white text-mtmh-m-regular'>
        <SantriActivityHeader />
      </div>

      <Card className='bg-mtmh-neutral-white text-mtmh-grey-base shadow-md border border-mtmh-snow-lighter rounded-md'>
        <CardContent className='flex flex-col p-0 gap-y-3'>
          <Suspense fallback={<ProgressGridSkeleton />}>
            <ActivityGrid />
          </Suspense>
        </CardContent>
      </Card>
    </section>
  )
}

async function ActivityGrid() {
  const user = await getUser()

  const activitiesInstance = new Activities()
  const activities = await activitiesInstance.list({
    parent_id: user.data?.id,
    start_date: dayjs().startOf('week').toISOString(),
    end_date: dayjs().endOf('week').toISOString()
  })

  return (
    <ProgressGridWithState
      activities={activities.data}
      className='border-none rounded-none'
      editable={false}
    />
  )
}
