import {
  HomeIcon as HomeIconSolid,
  UserIcon as UserIconSolid,
  CalendarIcon as CalendarIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid
} from '@heroicons/react/24/solid'
import {
  HomeIcon,
  UserIcon,
  CalendarIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'
import { BottomNavbarLink } from '@/models/bottom-navbar'

export const ACTIVE_ICONS: Record<string, BottomNavbarLink['icon']> = {
  '/ustadz': HomeIconSolid,
  '/ustadz/santri': UserIconSolid,
  '/ustadz/halaqah': CalendarIconSolid,
  '/ustadz/pengaturan': Cog6ToothIconSolid
}

export const MENUS: BottomNavbarLink[] = [
  {
    icon: HomeIcon,
    text: 'Beranda',
    href: '/ustadz',
    active: false
  },
  {
    icon: UserIcon,
    text: 'Santri',
    href: '/ustadz/santri',
    active: false
  },
  {
    icon: CalendarIcon,
    text: 'Kalender',
    href: '/ustadz/halaqah',
    active: false
  },
  {
    icon: Cog6ToothIcon,
    text: 'Pengaturan',
    href: '/ustadz/pengaturan',
    active: false
  }
]
