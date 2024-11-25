import {
  HomeIcon as HomeIconSolid,
  BookOpenIcon as BookOpenIconSolud,
  PresentationChartLineIcon as PresentationChartLineIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid
} from '@heroicons/react/24/solid'
import {
  HomeIcon,
  BookOpenIcon,
  PresentationChartLineIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'
import { BottomNavbarLink } from '@/models/bottom-navbar'
import { Menu } from '@/models/menus'

export const ACTIVE_ICONS: Record<string, BottomNavbarLink['icon']> = {
  '/santri': HomeIconSolid,
  '/santri/aktivitas': BookOpenIconSolud,
  '/santri/pencapaian': PresentationChartLineIconSolid,
  '/santri/pengaturan': Cog6ToothIconSolid
}

export const MENUS: Menu[] = [
  {
    icon: HomeIcon,
    text: 'Beranda',
    href: '/santri',
    pattern: /^\/santri$/,
    active: false
  },
  {
    icon: BookOpenIcon,
    text: 'Aktivitas',
    href: '/santri/aktivitas',
    pattern: /^\/santri\/aktivitas$/,
    active: false
  },
  {
    icon: PresentationChartLineIcon,
    text: 'Pencapaian',
    href: '/santri/pencapaian',
    pattern: /^\/santri\/pencapaian$/,
    active: false
  },
  {
    icon: Cog6ToothIcon,
    text: 'Pengaturan',
    href: '/santri/pengaturan',
    pattern: /^\/santri\/pengaturan$/,
    active: false
  }
]
