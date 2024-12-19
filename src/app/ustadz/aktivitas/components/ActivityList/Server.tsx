import { ActivityListProps, LIMIT } from '@/models/activity-list'
import { getActivities } from '../../actions'
import { ActivityListClient } from './Client'

export async function ActivityList(props: Readonly<ActivityListProps>) {
  const result = await getActivities({
    offset: 0,
    limit: LIMIT,
    filter: props
  })

  if (!result.success) {
    return <div>failed to get data</div>
  }

  if (result.data && !result.data.length) {
    return <div>activity not found</div>
  }

  return (
    <div>
      <ActivityListClient initialActivities={result.data!} {...props} />
    </div>
  )
}
