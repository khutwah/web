'use client'

import { generateMenus } from '@/utils/menus'
import { ACTIVE_ICONS, MENUS } from '@/utils/menus/lajnah'
import { usePathname } from 'next/navigation'
import { PropsWithChildren } from 'react'
import { BaseLayout } from '@/components/Layout/Base'

export function Layout({ children }: PropsWithChildren) {
  const pathname = usePathname()
  const menus = generateMenus(MENUS, ACTIVE_ICONS, pathname)
  return <BaseLayout menus={menus}>{children}</BaseLayout>
}
