'use server'

import { GetActivitiesArgs } from '@/models/activity-list'
import {
  createErrorResponse,
  createSuccessResponse
} from '@/utils/api/response-generator'
import { getUser } from '@/utils/supabase/get-user'
import { Activities } from '@/utils/supabase/models/activities'
import { Students } from '@/utils/supabase/models/students'
import { PostgrestError } from '@supabase/supabase-js'

export async function getActivities({
  offset,
  limit,
  filter: { studentId } = {}
}: GetActivitiesArgs) {
  try {
    const user = await getUser()
    const activitiesInstance = new Activities()
    const activities = await activitiesInstance.list({
      student_id: studentId,
      ustadz_id: user.id,
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

export async function getStudents() {
  try {
    const user = await getUser()
    const studentInstance = new Students()
    const students = await studentInstance.list({
      ustadz_id: user.id
    })

    if (students.error) {
      throw students.error
    }

    return createSuccessResponse({
      data: students.data
    })
  } catch (error: unknown) {
    const e = error as PostgrestError

    return createErrorResponse({
      code: e.code || '500',
      message: e.message || 'Something went wrong'
    })
  }
}
