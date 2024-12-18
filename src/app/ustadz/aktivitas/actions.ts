'use server'

import { getUser } from '@/utils/supabase/get-user'
import { Activities } from '@/utils/supabase/models/activities'

export async function getActivities(offset: number, limit: number) {
  try {
    const user = await getUser()
    const activitiesInstance = new Activities()
    const activities = await activitiesInstance.list({
      ustadz_id: user.data?.id,
      offset: offset,
      limit: limit,
      order_by: [
        ['status', 'desc'],
        ['id', 'desc']
      ]
    })

    if (activities.error) {
      throw new Error(activities.error)
    }

    return {
      success: true,
      message: '',
      data: activities.data
    }
  } catch (error) {
    const e = error instanceof Error ? error.message : String(error)
    return {
      success: false,
      data: null,
      message: e
    }
  }
}
