import { UNAUTHORIZE } from '@/models/copywriting/auth'
import { ERROR_CODES } from '@/models/error-translator'
import {
  createErrorResponse,
  createSuccessResponse
} from '@/utils/api/response-generator'
import { parseFilter } from '@/utils/parse-filter'
import { broadcast } from '@/utils/realtime/generic'
import {
  activityCreateSchema,
  activityFilterSchema
} from '@/utils/schemas/activities'
import { errorTranslator } from '@/utils/supabase/error-translator'
import { getUserId } from '@/utils/supabase/get-user-id'
import { Activities } from '@/utils/supabase/models/activities'
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

  const filters = parseFilter(request)

  let _filters = {}
  try {
    _filters = await activityFilterSchema.validate(filters)
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

  const activities = new Activities()
  const response = await activities.list({
    ...roleFilter,
    ..._filters
  })

  if (response?.error) {
    return Response.json(createErrorResponse(errorTranslator(response.error)))
  }

  if (!response?.data) {
    return Response.json(createErrorResponse(ERROR_CODES.PGRST116))
  }

  return Response.json(
    createSuccessResponse({
      data: response?.data ?? null
    }),
    { status: 200 }
  )
}

export async function POST(request: NextRequest) {
  let body = await request.json()
  try {
    body = await activityCreateSchema.validate(body)
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

  const activity = new Activities()

  // TODO(dio): Make it domain-specific, since alwaysCreate is not specific enough.
  const alwaysCreate =
    request.nextUrl.searchParams.get('alwaysCreate') !== null &&
    request.nextUrl.searchParams.get('alwaysCreate') === 'true'
  if (alwaysCreate) {
    if (Array.isArray(body.tags) && !body.tags.includes('persiapan')) {
      body.tags.push('persiapan')
    } else {
      body.tags = ['persiapan']
    }
  }
  const response = await activity.create(body, alwaysCreate)

  if (response.error) {
    return Response.json(response.error, {
      status: 500
    })
  }

  await broadcast()

  return Response.json(
    createSuccessResponse({
      data: null
    }),
    { status: 201 }
  )
}
