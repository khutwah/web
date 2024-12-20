'use client'

import { useState, useTransition } from 'react'
import { getActivities } from '../../actions'
import { Button } from '@/components/Button/Button'
import { ActivityListClientProps, LIMIT } from '@/models/activity-list'
import { ActivityStatus, ActivityTypeKey } from '@/models/activities'
import { useSearchParams } from 'next/navigation'
import { ActivityPopup } from '@/components/ActivityPopup'
import { ActivityBriefCard } from '@/components/ActivityCard/ActivityBriefCard'
import { Loader2 } from 'lucide-react'

export function ActivityListClient({
  initialActivities,
  tz,
  ...filter
}: Readonly<ActivityListClientProps>) {
  const [activities, setActivities] = useState(initialActivities)
  const [offset, setOffset] = useState(initialActivities.length)
  const [isPending, startTransition] = useTransition()
  const [finish, setFinish] = useState(initialActivities.length < LIMIT)

  const params = useSearchParams()

  const loadMore = async () => {
    startTransition(async () => {
      const response = await getActivities({
        offset,
        limit: LIMIT,
        filter: filter
      })
      if (response.success) {
        if (!response.data!.length) {
          setFinish(true)
          return
        }

        const data = response.data!
        const length = data.length

        if (length < LIMIT) {
          setFinish(true)
        }
        setActivities((p) => [...p, ...response.data!])
        setOffset((_offset) => _offset + LIMIT)
      }
    })
  }

  const hasStudentId = params.get('student_id')
  return (
    <div className='p-4 pb-6'>
      <ActivityPopup activities={activities} />
      <div className='flex flex-col gap-4 pt-2'>
        {activities.map((item) => {
          const tags = item.tags as string[]
          return (
            <ActivityBriefCard
              key={item.id}
              tz={tz}
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
              notes={item.notes ?? ''}
              type={item.type as ActivityTypeKey}
              isStudentPresent={item.student_attendance === 'present'}
              studentName={hasStudentId ? '' : item.student_name!}
              halaqahName={item.halaqah_name!}
              labels={tags}
              status={item.status as ActivityStatus}
              searchParams={params}
            />
          )
        })}
      </div>
      {finish ? null : (
        <Button
          className='w-full mt-6'
          variant='primary'
          onClick={() => {
            if (isPending) return
            loadMore()
          }}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className='animate-spin mr-2' />
              Memuat...
            </>
          ) : (
            'Muat lebih banyak'
          )}
        </Button>
      )}
    </div>
  )
}
