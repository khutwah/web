import { UNAUTHORIZE } from '@/models/copywriting/auth'
import { ERROR_CODES } from '@/models/error-translator'
import {
  createErrorResponse,
  createSuccessResponse
} from '@/utils/api/response-generator'
import { errorTranslator } from '@/utils/supabase/error-translator'
import { getUserId } from '@/utils/supabase/get-user-id'
import { Students } from '@/utils/supabase/models/students'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const roleFilter = await getUserId()

  if (!roleFilter) {
    return Response.json(
      createErrorResponse({
        code: 403,
        message: UNAUTHORIZE
      })
    )
  }

  const students = new Students()

  const searchParams = request.nextUrl.searchParams
  const halaqahIds = searchParams.get('halaqah_ids')

  const parsedHalaqahIds = halaqahIds ? halaqahIds.split(',').map(Number) : []

  const response = await students.list({
    halaqah_ids: parsedHalaqahIds,
    ...roleFilter
  })

  if (response?.error) {
    return Response.json(createErrorResponse(errorTranslator(response.error)))
  }

  if (!response?.data) {
    return Response.json(createErrorResponse(ERROR_CODES.PGRST116))
  }

  return Response.json(
    createSuccessResponse({
      data: response.data ?? null
    })
  )
}
