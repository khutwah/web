'use client'

import { BottomNavbar } from '@/components/BottomNavbar/BottomNavbar'
import { generateMenus } from '@/utils/menus'
import { ACTIVE_ICONS, MENUS } from '@/utils/menus/ustadz'
import { usePathname } from 'next/navigation'
import { PropsWithChildren } from 'react'

export function Layout({
  children
}: PropsWithChildren<{ className?: string }>) {
  const pathname = usePathname()
  const menus = generateMenus(MENUS, ACTIVE_ICONS, pathname)

  return (
    <div className='flex flex-col h-full'>
      <div className='flex flex-col flex-1 overflow-y-auto relative'>
        {children}
      </div>

      {menus ? (
        <div className='sticky bottom-0 left-0 w-full'>
          <BottomNavbar links={menus} />
        </div>
      ) : null}
    </div>
  )
}
