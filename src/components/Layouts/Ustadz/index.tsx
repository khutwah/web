'use client'

import { BottomNavbar } from '@/components/BottomNavbar/BottomNavbar'
import { generateMenus } from '@/utils/menus'
import { ACTIVE_ICONS, MENUS } from '@/utils/menus/ustadz'
import { usePathname } from 'next/navigation'
import { PropsWithChildren } from 'react'

export function Layout({ children }: PropsWithChildren) {
  const pathname = usePathname()
  const menus = generateMenus(MENUS, ACTIVE_ICONS, pathname)

  return (
    <div className='pb-20'>
      {children}
      {menus ? (
        <div className='fixed bottom-0 left-0 w-full'>
          <BottomNavbar links={menus} />
        </div>
      ) : null}
    </div>
  )
}
