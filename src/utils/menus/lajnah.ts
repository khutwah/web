import {
  Sofa as BerandaActive,
  Users as SantriActive,
  FlameKindling as AsesmenActive,
  ToggleRight as PengaturanActive
} from 'lucide-react'
import {
  Armchair as Beranda,
  User as Santri,
  Flame as Asesmen,
  ToggleLeft as Pengaturan
} from 'lucide-react'
import { BottomNavbarLink } from '@/models/bottom-navbar'
import { Menu } from '@/models/menus'

export const MENU_LAJNAH_PATH_RECORDS = {
  home: '/lajnah',
  santri: '/lajnah/santri',
  asesmen: '/lajnah/asesmen',
  settings: '/lajnah/pengaturan'
} as const

export const ACTIVE_ICONS: Record<string, BottomNavbarLink['icon']> = {
  [MENU_LAJNAH_PATH_RECORDS.home]: BerandaActive,
  [MENU_LAJNAH_PATH_RECORDS.santri]: SantriActive,
  [MENU_LAJNAH_PATH_RECORDS.asesmen]: AsesmenActive,
  [MENU_LAJNAH_PATH_RECORDS.settings]: PengaturanActive
}

export const MENUS: Menu[] = [
  {
    icon: Beranda,
    text: 'Beranda',
    href: MENU_LAJNAH_PATH_RECORDS.home,
    pattern: /^\/lajnah$/,
    active: false
  },
  {
    icon: Santri,
    text: 'Santri',
    href: MENU_LAJNAH_PATH_RECORDS.santri,
    pattern: /^\/lajnah\/santri(\/.*)?$/,
    active: false
  },
  {
    icon: Asesmen,
    text: 'Asesmen',
    href: MENU_LAJNAH_PATH_RECORDS.asesmen,
    pattern: /^\/lajnah\/asesmen(\/.*)?$/,
    active: false
  },
  {
    icon: Pengaturan,
    text: 'Pengaturan',
    href: MENU_LAJNAH_PATH_RECORDS.settings,
    pattern: /^\/lajnah\/pengaturan$/,
    active: false
  }
]
