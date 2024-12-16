import {
  Sofa as BerandaActive,
  Users as SantriActive,
  CircleDashed as HalaqahActive,
  ToggleRight as PengaturanActive
} from 'lucide-react'
import {
  Armchair as Beranda,
  User as Santri,
  Circle as Halaqah,
  ToggleLeft as Pengaturan
} from 'lucide-react'
import { BottomNavbarLink } from '@/models/bottom-navbar'
import { Menu } from '@/models/menus'

export const MENU_USTADZ_PATH_RECORDS = {
  home: '/ustadz',
  santri: '/ustadz/santri',
  halaqah: '/ustadz/halaqah',
  settings: '/ustadz/pengaturan'
} as const

export const ACTIVE_ICONS: Record<string, BottomNavbarLink['icon']> = {
  [MENU_USTADZ_PATH_RECORDS.home]: BerandaActive,
  [MENU_USTADZ_PATH_RECORDS.santri]: SantriActive,
  [MENU_USTADZ_PATH_RECORDS.halaqah]: HalaqahActive,
  [MENU_USTADZ_PATH_RECORDS.settings]: PengaturanActive
}

export const MENUS: Menu[] = [
  {
    icon: Beranda,
    text: 'Beranda',
    href: MENU_USTADZ_PATH_RECORDS.home,
    pattern: /^\/ustadz$/,
    active: false
  },
  {
    icon: Santri,
    text: 'Santri',
    href: MENU_USTADZ_PATH_RECORDS.santri,
    pattern: /^\/ustadz\/santri(\/.*)?$/,
    active: false
  },
  {
    icon: Halaqah,
    text: 'Halaqah',
    href: MENU_USTADZ_PATH_RECORDS.halaqah,
    pattern: /^\/ustadz\/halaqah(\/.*)?$/,
    active: false
  },
  {
    icon: Pengaturan,
    text: 'Pengaturan',
    href: MENU_USTADZ_PATH_RECORDS.settings,
    pattern: /^\/ustadz\/pengaturan$/,
    active: false
  }
]
