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
import { Menu } from '@/models/menus'

export const ACTIVE_ICONS: Record<string, BottomNavbarLink['icon']> = {
  '/ustadz': HomeIconSolid,
  '/ustadz/santri': UserIconSolid,
  '/ustadz/halaqah': CalendarIconSolid,
  '/ustadz/pengaturan': Cog6ToothIconSolid
}

export const MENUS: Menu[] = [
  {
    icon: HomeIcon,
    text: 'Beranda',
    href: '/ustadz',
    pattern: /^\/ustadz$/,
    active: false
  },
  {
    icon: UserIcon,
    text: 'Santri',
    href: '/ustadz/santri',
    pattern: /^\/ustadz\/santri(\/.*)?$/,
    active: false
  },
  {
    icon: CalendarIcon,
    text: 'Kalender',
    href: '/ustadz/halaqah',
    pattern: /^\/ustadz\/halaqah$/,
    active: false
  },
  {
    icon: Cog6ToothIcon,
    text: 'Pengaturan',
    href: '/ustadz/pengaturan',
    pattern: /^\/ustadz\/pengaturan$/,
    active: false
  }
]
