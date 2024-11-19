import { UNAUTHORIZE } from '@/models/copywriting/auth'
import { ERROR_CODES } from '@/models/error-translator'
import {
  createErrorResponse,
  createSuccessResponse
} from '@/utils/api/response-generator'
import { errorTranslator } from '@/utils/supabase/error-translator'
import { getUserId } from '@/utils/supabase/get-user-id'
import { Halaqah } from '@/utils/supabase/models/halaqah'

export async function GET() {
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

  const halaqah = new Halaqah()
  const response = await halaqah.list(roleFilter)

  if (response?.error) {
    return Response.json(createErrorResponse(errorTranslator(response.error)), {
      status: 500
    })
  }

  if (!response?.data) {
    return Response.json(createErrorResponse(ERROR_CODES.PGRST116), {
      status: 404
    })
  }

  return Response.json(
    createSuccessResponse({
      data: response?.data ?? null
    }),
    { status: 200 }
  )
}
