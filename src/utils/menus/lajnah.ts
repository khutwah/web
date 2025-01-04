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
  home: '/ustadz',
  santri:
    '/ustadz/santri?ustadz_id=ALL&checkpoint_status=lajnah-assessment-ready',
  asesmen: '/ustadz/asesmen',
  settings: '/ustadz/pengaturan'
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
    pattern: /^\/ustadz$/,
    active: false
  },
  {
    icon: Santri,
    text: 'Santri',
    href: MENU_LAJNAH_PATH_RECORDS.santri,
    pattern: /^\/ustadz\/santri(\/.*)?$/,
    active: false
  },
  {
    icon: Asesmen,
    text: 'Asesmen',
    href: MENU_LAJNAH_PATH_RECORDS.asesmen,
    pattern: /^\/ustadz\/asesmen(\/.*)?$/,
    active: false
  },
  {
    icon: Pengaturan,
    text: 'Pengaturan',
    href: MENU_LAJNAH_PATH_RECORDS.settings,
    pattern: /^\/ustadz\/pengaturan$/,
    active: false
  }
]
