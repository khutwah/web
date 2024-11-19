import { Auth } from './models/auth'
import { User } from './models/user'

export async function getUserRole(): Promise<number> {
  const auth = new Auth()
  const _auth = await auth.get()

  const user = new User()
  const _user = await user.get({
    email: _auth?.email || ''
  })

  return _user.data?.role ?? -1
}
