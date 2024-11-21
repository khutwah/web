import { UNAUTHORIZE } from '@/models/copywriting/auth'
import { INVALID_PAYLOAD } from '@/models/copywriting/data'
import { ERROR_CODES } from '@/models/error-translator'
import {
  createErrorResponse,
  createSuccessResponse
} from '@/utils/api/response-generator'
import { parseFilter } from '@/utils/parse-filter'
import { halaqahFilterSchema } from '@/utils/schemas/halaqah'
import { errorTranslator } from '@/utils/supabase/error-translator'
import { getUserId } from '@/utils/supabase/get-user-id'
import { Halaqah } from '@/utils/supabase/models/halaqah'
import { validate } from '@/utils/validation/id'
import { NextRequest } from 'next/server'

interface ParamsType {
  params: Promise<{ id: string }>
}
export async function GET(request: NextRequest, { params }: ParamsType) {
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

  const filters = parseFilter(request)
  let _filters = {}
  try {
    _filters = await halaqahFilterSchema.validate(filters)
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

  const halaqah = new Halaqah()
  const response = await halaqah.get(id, { ...roleFilter, ..._filters })

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
