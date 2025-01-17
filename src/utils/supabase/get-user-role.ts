import { Auth } from './models/auth'
import { User } from './models/user'
import { cookies } from 'next/headers'

export async function getUserRole(): Promise<number> {
  const cookieStore = await cookies()
  const role = cookieStore.get('role')?.value
  if (role) {
    return parseInt(role)
  }

  return getUserRoleFromServer()
}

async function getUserRoleFromServer() {
  const auth = await new Auth().get()
  const user = await new User().get({
    email: auth?.email || ''
  })

  return user.data?.role ?? -1
}
