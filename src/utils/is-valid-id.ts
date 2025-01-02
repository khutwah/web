import { number } from 'yup'

export default async function isValidId({ id }: { id: string }) {
  const schema = number().required()

  try {
    const result = await schema.validate(id)
    return result
  } catch {
    return 0
  }
}
