'use server'

import { PostgrestError } from '@supabase/supabase-js'

import {
  createErrorResponse,
  createSuccessResponse
} from '@/utils/api/response-generator'
import { Activities } from '@/utils/supabase/models/activities'

type GetActivitiesArgs = {
  studentId?: number
  ustadzId?: number
  startDate?: string
  endDate?: string
}

export async function getActivities(args: GetActivitiesArgs = {}) {
  try {
    const activitiesInstance = new Activities()
    const result = await activitiesInstance.list({
      ustadz_id: args.ustadzId,
      student_id: args.studentId,
      start_date: args.startDate,
      end_date: args.endDate
    })

    if (result.error) {
      throw result.error
    }

    return createSuccessResponse({
      data: result.data
    })
  } catch (error: unknown) {
    const e = error as PostgrestError

    return createErrorResponse({
      code: e.code || '500',
      message: e.message || 'Something went wrong'
    })
  }
}
