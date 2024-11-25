import { BottomNavbarLink } from '@/models/bottom-navbar'
import { Menu } from '@/models/menus'

export function generateMenus(
  menus: Menu[],
  activeIcons: Record<string, BottomNavbarLink['icon']>,
  pathname: string
): BottomNavbarLink[] | null {
  const menuExist = menus.some((item) => item.pattern.test(pathname))
  if (!menuExist) return null

  return menus.map((item) => {
    if (item.pattern.test(pathname)) {
      return {
        ...item,
        active: true,
        icon: activeIcons[item.href]
      }
    }
    return item
  })
}
