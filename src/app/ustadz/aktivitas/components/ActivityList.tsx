'use client'

import { useState, useTransition } from 'react'
import { getActivities } from '../actions'
import { Button } from '@/components/Button/Button'
import { ActivityListProps, LIMIT } from '@/models/activity-list'

export function ActivityList({
  initialActivities
}: Readonly<ActivityListProps>) {
  const [activities, setActivities] = useState(initialActivities)
  const [offset, setOffset] = useState(initialActivities.length)
  const [isPending, startTransition] = useTransition()
  const [finish, setFinish] = useState(false)

  const loadMore = async () => {
    startTransition(async () => {
      const response = await getActivities(offset, LIMIT)
      if (response.success) {
        if (!response.data!.length) {
          setFinish(true)
          return
        }
        setActivities((p) => [...p, ...response.data!])
        setOffset((_offset) => _offset + LIMIT)
      }
    })
  }

  return (
    <div>
      {activities.map((item) => (
        <div key={item.id}>
          {item.status} + {item.created_at}
        </div>
      ))}
      {finish ? (
        <div>data sudah habis</div>
      ) : (
        <Button
          className='w-full mt-4'
          variant='primary'
          onClick={loadMore}
          disabled={isPending}
        >
          {isPending ? 'Loading...' : 'Load More'}
        </Button>
      )}
    </div>
  )
}
