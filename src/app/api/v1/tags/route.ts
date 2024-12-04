import { ERROR_CODES } from '@/models/error-translator'
import {
  createErrorResponse,
  createSuccessResponse
} from '@/utils/api/response-generator'
import { errorTranslator } from '@/utils/supabase/error-translator'
import { Tags } from '@/utils/supabase/models/tags'

export async function GET() {
  const tags = new Tags()
  const response = await tags.list()

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
