import { BottomNavbar } from './BottomNavbar'

import { Sofa as BerandaActive, Users as SantriActive } from 'lucide-react'
import {
  Armchair as Beranda,
  User as Santri,
  Circle as Halaqah,
  ToggleLeft as Pengaturan
} from 'lucide-react'

export function BottomNavbarStory() {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8'>
      <BottomNavbar
        links={[
          {
            icon: BerandaActive,
            text: 'Beranda',
            href: '/',
            active: true
          },
          {
            icon: Santri,
            text: 'Santri',
            href: '/students',
            active: false
          },
          {
            icon: Halaqah,
            text: 'Halaqah',
            href: '/halaqah',
            active: false
          },
          {
            icon: Pengaturan,
            text: 'Pengaturan',
            href: '/settings',
            active: false
          }
        ]}
      />

      <BottomNavbar
        links={[
          {
            icon: Beranda,
            text: 'Beranda',
            href: '/',
            active: false
          },
          {
            icon: SantriActive,
            text: 'Santri',
            href: '/students',
            active: true
          },
          {
            icon: Halaqah,
            text: 'Halaqah',
            href: '/halaqah',
            active: false
          },
          {
            icon: Pengaturan,
            text: 'Pengaturan',
            href: '/settings',
            active: false
          }
        ]}
      />
    </div>
  )
}
