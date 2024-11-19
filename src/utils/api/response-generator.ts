import {
  CreateErrorResponseArgs,
  CreateSuccessResponseArgs,
  ErrorResponse,
  SuccessResponse
} from '@/models/response-generator'

export function createSuccessResponse({
  data,
  message = ''
}: CreateSuccessResponseArgs): SuccessResponse {
  return {
    status: 'success',
    message,
    data: data
  }
}

export function createErrorResponse({
  code,
  details,
  message = ''
}: CreateErrorResponseArgs): ErrorResponse {
  return {
    status: 'error',
    message,
    error: {
      code,
      details
    }
  }
}
