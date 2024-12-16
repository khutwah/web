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

export const ACTIVE_ICONS: Record<string, BottomNavbarLink['icon']> = {
  '/santri': BerandaActive,
  '/santri/aktivitas': AktivitasActive,
  '/santri/pencapaian': PencapaianActive,
  '/santri/pengaturan': PengaturanActive
}

export const MENUS: Menu[] = [
  {
    icon: Beranda,
    text: 'Beranda',
    href: '/santri',
    pattern: /^\/santri$/,
    active: false
  },
  {
    icon: Aktivitas,
    text: 'Aktivitas',
    href: '/santri/aktivitas',
    pattern: /^\/santri\/aktivitas$/,
    active: false
  },
  {
    icon: Pencapaian,
    text: 'Pencapaian',
    href: '/santri/pencapaian',
    pattern: /^\/santri\/pencapaian$/,
    active: false
  },
  {
    icon: Pengaturan,
    text: 'Pengaturan',
    href: '/santri/pengaturan',
    pattern: /^\/santri\/pengaturan$/,
    active: false
  }
]
