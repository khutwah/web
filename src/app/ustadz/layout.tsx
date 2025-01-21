import { Refresher } from '@/components/Page/Refresher'
import { ROLE } from '@/models/auth'
import { isAllowedRoles } from '@/utils/auth/is-allowed-roles'
import { PropsWithChildren } from 'react'

export default async function UstadzLayout({ children }: PropsWithChildren) {
  await isAllowedRoles([ROLE.USTADZ, ROLE.LAJNAH])
  return (
    <main>
      <Refresher />
      {children}
    </main>
  )
}
