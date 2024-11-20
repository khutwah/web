import { UNAUTHORIZE } from '@/models/copywriting/auth'
import { INVALID_PAYLOAD } from '@/models/copywriting/data'
import { ERROR_CODES } from '@/models/error-translator'
import {
  createErrorResponse,
  createSuccessResponse
} from '@/utils/api/response-generator'
import { errorTranslator } from '@/utils/supabase/error-translator'
import { getUserId } from '@/utils/supabase/get-user-id'
import { Halaqah } from '@/utils/supabase/models/halaqah'
import { validate } from '@/utils/validation/id'

interface ParamsType {
  params: Promise<{ id: string }>
}
export async function GET(_request: Request, { params }: ParamsType) {
  const id = await validate(await params)

  if (!id) {
    return Response.json(
      createErrorResponse({
        code: '400',
        message: INVALID_PAYLOAD
      }),
      { status: 400 }
    )
  }

  const filter = await getUserId()

  if (!filter) {
    return Response.json(
      createErrorResponse({
        code: '403',
        message: UNAUTHORIZE
      }),
      { status: 403 }
    )
  }

  const halaqah = new Halaqah()
  const response = await halaqah.get(id, filter)

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
