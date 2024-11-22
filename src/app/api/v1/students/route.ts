import { UNAUTHORIZE } from '@/models/copywriting/auth'
import { ERROR_CODES } from '@/models/error-translator'
import {
  createErrorResponse,
  createSuccessResponse
} from '@/utils/api/response-generator'
import { parseFilter } from '@/utils/parse-filter'
import { studentsFilterSchema } from '@/utils/schemas/students'
import { errorTranslator } from '@/utils/supabase/error-translator'
import { getUserId } from '@/utils/supabase/get-user-id'
import { Students } from '@/utils/supabase/models/students'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const roleFilter = await getUserId()

  if (!roleFilter) {
    return Response.json(
      createErrorResponse({
        code: '403',
        message: UNAUTHORIZE
      }),
      { status: 403 }
    )
  }

  const students = new Students()

  const filters = parseFilter(request)

  let _filters = {}
  try {
    _filters = await studentsFilterSchema.validate(filters)
  } catch (e) {
    return Response.json(
      createErrorResponse({
        code: '400',
        message: 'invalid input',
        details: (e as Error).message
      }),
      { status: 400 }
    )
  }

  const response = await students.list({
    ...roleFilter,
    ..._filters
  })

  if (response?.error) {
    return Response.json(createErrorResponse(errorTranslator(response.error)), {
      status: 500
    })
  }

  if (!response?.data) {
    return Response.json(createErrorResponse(ERROR_CODES.PGRST116), {
      status: 400
    })
  }

  return Response.json(
    createSuccessResponse({
      data: response.data ?? null
    }),
    { status: 200 }
  )
}
