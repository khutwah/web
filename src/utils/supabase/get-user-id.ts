import { IDENTIFIER_BY_ROLE } from '@/models/auth'
import { Auth } from './models/auth'
import { User } from './models/user'

export async function getUserId() {
  const auth = new Auth()
  const _auth = await auth.get()

  const user = new User()
  const _user = await user.get({
    email: _auth?.email || ''
  })

  const key = IDENTIFIER_BY_ROLE[_user.data?.role ?? 0]

  if (!key) return

  return {
    [key]: _user.data?.id ?? -1
  }
}
