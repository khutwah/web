import { ActivityListProps, LIMIT } from '@/models/activity-list'
import { getActivities } from '../../actions'
import { ActivityListClient } from './Client'
import { Button } from '@/components/Button/Button'
import { Rabbit, SearchX } from 'lucide-react'
import getTimezoneInfo from '@/utils/get-timezone-info'

export async function ActivityList(props: Readonly<ActivityListProps>) {
  const result = await getActivities({
    offset: 0,
    limit: LIMIT,
    filter: props
  })

  const tz = await getTimezoneInfo()

  if (!result.success) {
    return (
      <div className='flex flex-col items-center p-4 gap-4 mt-10'>
        <div className='text-mtmh-red-base'>
          <Rabbit size={128} />
        </div>
        <p className='text-mtmh-neutral-70 text-center w-9/12 mt-2'>
          Maaf, terdapat kesalahan dalam memuat data.
        </p>
        <Button variant='primary' size='lg'>
          Muat Ulang
        </Button>
      </div>
    )
  }

  if (result.data && !result.data.length) {
    return (
      <div className='flex flex-col items-center p-4 gap-6 mt-10'>
        <div className='text-mtmh-red-base'>
          <SearchX size={128} />
        </div>
        <p className='text-mtmh-neutral-70 text-center w-9/12'>
          Aktivitas tidak ditemukan
        </p>
      </div>
    )
  }

  return (
    <div>
      <ActivityListClient tz={tz} initialActivities={result.data!} {...props} />
    </div>
  )
}
