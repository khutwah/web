export interface GeneralTypeResponse {
  status: 'success' | 'error'
  message: string
}
export interface SuccessResponse<T> extends GeneralTypeResponse {
  data: T
}

export interface ErrorResponse extends GeneralTypeResponse {
  error: {
    details?: string | ValidationError[]
    code: string
  }
}

export interface CreateSuccessResponseArgs<T> {
  data: T
  message?: string
}

export interface ValidationError {
  field: string
  message: string
}
export interface CreateErrorResponseArgs {
  code: string
  details?: string | ValidationError[]
  message: string
}
