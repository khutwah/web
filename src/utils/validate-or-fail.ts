import { Schema, ValidationError } from 'yup'

export async function validateOrFail<T>(
  fn: () => ReturnType<Schema<T>['validate']>
): Promise<T | { message: string }> {
  let validatedFields = {} as T

  try {
    validatedFields = await fn()

    return validatedFields
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return {
        message: error.message
      }
    }

    return {
      message: String(error)
    }
  }
}
