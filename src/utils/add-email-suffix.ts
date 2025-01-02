import { DEFAULT_EMAIL_DOMAIN } from '@/models/auth'
import { isEmail } from '@/utils/is-email'

export function addEmailSuffix(input: string) {
  return isEmail(input)
    ? input
    : input +
        '@' +
        (process.env.NEXT_PUBLIC_DEFAULT_EMAIL_DOMAIN || DEFAULT_EMAIL_DOMAIN)
}
