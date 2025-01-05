import 'server-only'

import { redirect } from 'next/navigation'
import { getUserRole } from '../supabase/get-user-role'
import { PAGE_BY_ROLE } from '@/models/auth'

export async function isAllowedRole(role: number) {
  return isAllowedRoles([role])
}

export async function isAllowedRoles(roles: number[]) {
  const userRole = await getUserRole()

  // User has no access
  if (userRole === -1) return redirect('/login')

  // A non-eligible user will be redirected to the right page.
  if (!roles.includes(userRole)) return redirect(PAGE_BY_ROLE[userRole] ?? '/')

  return
}
