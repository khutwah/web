import { IDENTIFIER_BY_ROLE } from '@/models/auth'
import { Auth } from './models/auth'
import { User } from './models/user'
import { cookies } from 'next/headers'

export async function getUserId() {
  const cookieStore = await cookies()
  let storedUserId = cookieStore.get('user')?.value
  let storedRole = cookieStore.get('role')?.value

  if (!storedUserId || !storedRole) {
    const auth = await new Auth().get()
    const user = await new User().get({
      email: auth?.email || ''
    })
    storedRole = `${user.data?.role ?? -1}`
    storedUserId = `${user.data?.id ?? -1}`
  }

  const key = IDENTIFIER_BY_ROLE[Number(storedRole ?? -1)]
  if (!key) {
    return
  }

  return {
    [key]: Number(storedUserId)
  }
}
