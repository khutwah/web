import { ROLE } from '@/models/auth'
import { isAllowedRole } from '@/utils/auth/is-allowed-role'
import { PropsWithChildren } from 'react'

export default async function UstadzLayout({ children }: PropsWithChildren) {
  await isAllowedRole(ROLE.USTADZ)
  return <main>{children}</main>
}
