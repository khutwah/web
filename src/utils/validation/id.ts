import { number } from 'yup'

export async function validate({ id }: { id: string }) {
  const schema = number().required()

  try {
    const result = await schema.validate(id)
    return result
  } catch {
    return 0
  }
}
