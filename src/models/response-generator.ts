export interface GeneralTypeResponse {
  status: 'success' | 'error'
  message: string
}
export interface SuccessResponse extends GeneralTypeResponse {
  data: unknown
}

export interface ErrorResponse extends GeneralTypeResponse {
  error: {
    details?: string | ValidationError[]
    code: string
  }
}

export interface CreateSuccessResponseArgs {
  data: unknown
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
