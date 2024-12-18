import { LIMIT } from '@/models/activity-list'
import { getActivities } from './actions'
import { ActivityList } from './components/ActivityList'

export default async function Aktivitas() {
  const result = await getActivities(0, LIMIT)

  if (!result.success) {
    return <div>failed to get data</div>
  }

  if (result.data && !result.data.length) {
    return <div>activity not found for ustadz</div>
  }

  return (
    <div>
      <ActivityList initialActivities={result.data!} />
    </div>
  )
}
