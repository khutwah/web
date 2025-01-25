import { Auth } from './models/auth'
import { User } from './models/user'

export async function getUser() {
  const auth = new Auth()
  const _auth = await auth.get()

  const user = new User()
  const { data, error } = await user.get({
    email: _auth?.email || ''
  })

  if (error) {
    // This is unlikely to happen, but just in case.
    // So doing this let us have a better typing for user.
    return { id: 0, name: '', email: '' }
  }
  return data
}
