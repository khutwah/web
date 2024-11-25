import { BottomNavbarLink } from '@/models/bottom-navbar'

export function generateMenus(
  menus: BottomNavbarLink[],
  activeIcons: Record<string, BottomNavbarLink['icon']>,
  pathname: string
): BottomNavbarLink[] | null {
  const menuExist = menus.some((item) => item.href === pathname)
  if (!menuExist) return null

  return menus.map((item) => {
    if (item.href === pathname) {
      return {
        ...item,
        active: true,
        icon: activeIcons[pathname as keyof typeof activeIcons]
      }
    }
    return item
  })
}
