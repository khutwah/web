'use server'

import { Layout as UstadzLayout } from './Roles/Ustadz'
import { Layout as LajnahLayout } from './Roles/Lajnah'
import { PropsWithChildren } from 'react'
import { ROLE } from '@/models/auth'
import { getUserRole } from '@/utils/supabase/get-user-role'

export async function Layout({ children }: PropsWithChildren) {
  return (await getUserRole()) === ROLE.USTADZ ? (
    <UstadzLayout>{children}</UstadzLayout>
  ) : (
    <LajnahLayout>{children}</LajnahLayout>
  )
}
