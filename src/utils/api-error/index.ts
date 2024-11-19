interface ApiErrorConstructorArgs {
  message: string
  code?: string
  status: number
}

export class ApiError extends Error {
  code?: string
  status: number

  constructor(payload: ApiErrorConstructorArgs) {
    super(payload.message)
    this.name = 'PostgrestError'
    this.code = payload.code
    this.status = payload.status
  }
}
