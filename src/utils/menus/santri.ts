import {
  Sofa as BerandaActive,
  BookOpenText as AktivitasActive,
  ChartNoAxesCombined as PencapaianActive,
  ToggleRight as PengaturanActive
} from 'lucide-react'
import {
  Armchair as Beranda,
  BookOpen as Aktivitas,
  ChartNoAxesColumnIncreasing as Pencapaian,
  ToggleLeft as Pengaturan
} from 'lucide-react'
import { BottomNavbarLink } from '@/models/bottom-navbar'
import { Menu } from '@/models/menus'

export const MENU_SANTRI_PATH_RECORDS = {
  home: '/santri',
  aktivitas: '/santri/aktivitas',
  pencapaian: '/santri/pencapaian',
  settings: '/santri/pengaturan'
} as const

export const ACTIVE_ICONS: Record<string, BottomNavbarLink['icon']> = {
  [MENU_SANTRI_PATH_RECORDS.home]: BerandaActive,
  [MENU_SANTRI_PATH_RECORDS.aktivitas]: AktivitasActive,
  [MENU_SANTRI_PATH_RECORDS.pencapaian]: PencapaianActive,
  [MENU_SANTRI_PATH_RECORDS.settings]: PengaturanActive
}

export const MENUS: Menu[] = [
  {
    icon: Beranda,
    text: 'Beranda',
    href: MENU_SANTRI_PATH_RECORDS.home,
    pattern: /^\/santri$/,
    active: false
  },
  {
    icon: Aktivitas,
    text: 'Aktivitas',
    href: MENU_SANTRI_PATH_RECORDS.aktivitas,
    pattern: /^\/santri\/aktivitas(\/.*)?$/,
    active: false
  },
  {
    icon: Pencapaian,
    text: 'Pencapaian',
    href: MENU_SANTRI_PATH_RECORDS.pencapaian,
    pattern: /^\/santri\/pencapaian$/,
    active: false
  },
  {
    icon: Pengaturan,
    text: 'Pengaturan',
    href: MENU_SANTRI_PATH_RECORDS.settings,
    pattern: /^\/santri\/pengaturan$/,
    active: false
  }
]
