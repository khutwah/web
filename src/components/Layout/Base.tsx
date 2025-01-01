'use client'

import { BottomNavbar } from '@/components/BottomNavbar/BottomNavbar'
import { BottomNavbarLink } from '@/models/bottom-navbar'
import { PropsWithChildren } from 'react'

interface BaseLayoutProps {
  menus: BottomNavbarLink[] | null
}

export function BaseLayout({
  children,
  menus
}: PropsWithChildren<BaseLayoutProps>) {
  return (
    <div className='flex flex-col h-full'>
      <div className='flex flex-col flex-1 overflow-y-auto relative'>
        {children}
      </div>

      {menus && (
        <div className='sticky bottom-0 left-0 w-full'>
          <BottomNavbar links={menus} />
        </div>
      )}
    </div>
  )
}
