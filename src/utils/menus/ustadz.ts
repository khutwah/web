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

export const MENU_PATH_RECORD = {
  home: '/ustadz',
  santri: '/ustadz/santri',
  halaqah: '/ustadz/halaqah',
  settings: '/ustadz/pengaturan'
} as const

export const ACTIVE_ICONS: Record<string, BottomNavbarLink['icon']> = {
  [MENU_PATH_RECORD.home]: HomeIconSolid,
  [MENU_PATH_RECORD.santri]: UserIconSolid,
  [MENU_PATH_RECORD.halaqah]: CalendarIconSolid,
  [MENU_PATH_RECORD.settings]: Cog6ToothIconSolid
}

export const MENUS: Menu[] = [
  {
    icon: HomeIcon,
    text: 'Beranda',
    href: MENU_PATH_RECORD.home,
    pattern: /^\/ustadz$/,
    active: false
  },
  {
    icon: UserIcon,
    text: 'Santri',
    href: MENU_PATH_RECORD.santri,
    pattern: /^\/ustadz\/santri(\/.*)?$/,
    active: false
  },
  {
    // TODO(imballinst): adjust to halaqah icon.
    icon: CalendarIcon,
    text: 'Kalender',
    href: MENU_PATH_RECORD.halaqah,
    pattern: /^\/ustadz\/halaqah(\/.*)$/,
    active: false
  },
  {
    icon: Cog6ToothIcon,
    text: 'Pengaturan',
    href: MENU_PATH_RECORD.settings,
    pattern: /^\/ustadz\/pengaturan$/,
    active: false
  }
]
