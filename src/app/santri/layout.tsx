import { ROLE } from '@/models/auth'
import { isAllowedRole } from '@/utils/auth/is-allowed-roles'
import { PropsWithChildren } from 'react'

export default async function StudentLayout({ children }: PropsWithChildren) {
  await isAllowedRole(ROLE.STUDENT)
  return <main>{children}</main>
}
