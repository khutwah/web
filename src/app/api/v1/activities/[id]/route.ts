import { doApiAction } from '@/utils/api-operation'
import {
  createErrorResponse,
  createSuccessResponse
} from '@/utils/api/response-generator'
import { activityCreateSchema } from '@/utils/schemas/activities'
import { Activities } from '@/utils/supabase/models/activities'
import isValidId from '@/utils/is-valid-id'
import { NextRequest } from 'next/server'
import { broadcast } from '@/utils/realtime/generic'

interface ParamsType {
  params: Promise<{ id: string }>
}
export async function PUT(request: NextRequest, { params }: ParamsType) {
  const id = await isValidId(await params)

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
      {
        status: 400
      }
    )
  }

  const activity = new Activities()

  return await doApiAction<ReturnType<typeof createSuccessResponse>>(
    async () => {
      await activity.update(id, body)
      await broadcast()

      return {
        data: createSuccessResponse({
          data: null
        }),
        status: 200
      }
    }
  )
}
