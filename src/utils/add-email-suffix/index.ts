import { DEFAULT_EMAIL_DOMAIN } from '@/models/auth'
import { isEmail } from '../is-email'

export function addEmailSuffix(input: string) {
  const email = isEmail(input) ? input : input + '@' + DEFAULT_EMAIL_DOMAIN
  return email
}
