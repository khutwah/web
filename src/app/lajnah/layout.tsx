import { ROLE } from '@/models/auth'
import { isAllowedRole } from '@/utils/auth/is-allowed-role'
import { PropsWithChildren } from 'react'

export default async function LajnahLayout({ children }: PropsWithChildren) {
  await isAllowedRole(ROLE.LAJNAH)
  return <main>{children}</main>
}
