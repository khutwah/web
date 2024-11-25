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

const ACTIVE_ICONS: Record<string, BottomNavbarLink['icon']> = {
  '/ustadz': HomeIconSolid,
  '/ustadz/santri': UserIconSolid,
  '/ustadz/halaqah': CalendarIconSolid,
  '/ustadz/settings': Cog6ToothIconSolid
}

const MENUS: BottomNavbarLink[] = [
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
    href: '/ustadz/settings',
    active: false
  }
]

export function generateUstadMenus(
  pathname: string
): BottomNavbarLink[] | null {
  const menuExist = MENUS.some((item) => item.href === pathname)
  if (!menuExist) return null

  return MENUS.map((item) => {
    if (item.href === pathname) {
      return {
        ...item,
        active: true,
        icon: ACTIVE_ICONS[pathname as keyof typeof ACTIVE_ICONS]
      }
    }
    return item
  })
}
