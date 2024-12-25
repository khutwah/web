'use server'

import { PostgrestError } from '@supabase/supabase-js'

import {
  createErrorResponse,
  createSuccessResponse
} from '@/utils/api/response-generator'
import { Students } from '@/utils/supabase/models/students'
import { CheckpointStatus } from '@/models/checkpoint'

type GetStudentsArgs = {
  ustadzId?: number
  checkpointStatuses?: Array<CheckpointStatus>
}
export async function getStudents({
  ustadzId,
  checkpointStatuses
}: GetStudentsArgs = {}) {
  try {
    const studentInstance = new Students()
    const result = await studentInstance.list({
      ustadz_id: ustadzId,
      checkpoint_statuses: checkpointStatuses
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
