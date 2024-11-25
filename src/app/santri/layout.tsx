import { ROLE } from '@/models/auth'
import { isHaveAccess } from '@/utils/auth/page-access'
import { PropsWithChildren } from 'react'

export default async function StudentLayout({ children }: PropsWithChildren) {
  await isHaveAccess(ROLE.STUDENT)
  return <>{children}</>
}
