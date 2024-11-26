import { Auth } from './models/auth'
import { User } from './models/user'

export async function getUser() {
  const auth = new Auth()
  const _auth = await auth.get()

  const user = new User()
  return user.get({
    email: _auth?.email || ''
  })
}
