import { BottomNavbar } from './BottomNavbar'

import { HomeIcon, UserIcon as UserSolid } from '@heroicons/react/24/solid'
import {
  UserIcon,
  CalendarIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'

export function BottomNavbarStory() {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8'>
      <BottomNavbar
        links={[
          {
            icon: HomeIcon,
            text: 'Beranda',
            href: '/',
            active: true
          },
          {
            icon: UserIcon,
            text: 'Santri',
            href: '/students',
            active: false
          },
          {
            icon: CalendarIcon,
            text: 'Kalender',
            href: '/calendar',
            active: false
          },
          {
            icon: Cog6ToothIcon,
            text: 'Pengaturan',
            href: '/settings',
            active: false
          }
        ]}
      />

      <BottomNavbar
        links={[
          {
            icon: HomeIcon,
            text: 'Beranda',
            href: '/',
            active: false
          },
          {
            icon: UserSolid,
            text: 'Santri',
            href: '/students',
            active: true
          },
          {
            icon: CalendarIcon,
            text: 'Kalender',
            href: '/calendar',
            active: false
          },
          {
            icon: Cog6ToothIcon,
            text: 'Pengaturan',
            href: '/settings',
            active: false
          }
        ]}
      />
    </div>
  )
}
