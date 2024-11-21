import { ApiError } from '../api-error'
import { createErrorResponse } from '../api/response-generator'

type ApiAction<T> = () => Promise<{ data: T; status: number }>

export async function doApiAction<T>(action: ApiAction<T>) {
  try {
    const result = await action()
    return Response.json(result.data, { status: result.status })
  } catch (error) {
    let status = 500
    let code = '500'
    let message = error instanceof Error ? error.message : String(error)

    if (error instanceof ApiError) {
      code = error.code ?? '500'
      status = error.status
      message = message
    }

    return Response.json(
      createErrorResponse({
        code,
        message
      }),
      { status: status }
    )
  }
}
