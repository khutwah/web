import { BottomNavbar } from './BottomNavbar'

import { HomeIcon, UsersIcon as UserSolid } from 'lucide-react'
import { UserIcon, CalendarIcon, Settings2Icon } from 'lucide-react'

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
            icon: Settings2Icon,
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
            icon: Settings2Icon,
            text: 'Pengaturan',
            href: '/settings',
            active: false
          }
        ]}
      />
    </div>
  )
}
