'use server'

import { PostgrestError } from '@supabase/supabase-js'

import {
  createErrorResponse,
  createSuccessResponse
} from '@/utils/api/response-generator'
import { User } from '@/utils/supabase/models/user'
import { ROLE } from '@/models/auth'

export async function getUstadzs() {
  try {
    const userInstance = new User()

    const result = await userInstance.list({ role: ROLE.USTADZ })

    if (result.error) {
      throw result.error
    }

    return createSuccessResponse({
      data: result.data?.map((item) => ({ id: item.id, name: item.name }))
    })
  } catch (error: unknown) {
    const e = error as PostgrestError

    return createErrorResponse({
      code: e.code || '500',
      message: e.message || 'Something went wrong'
    })
  }
}
