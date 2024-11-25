import { ComponentType, SVGProps } from 'react'

export interface BottomNavbarLink {
  text: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  href: string
  active: boolean
}

export interface BottomNavbarProps {
  links: BottomNavbarLink[]
}
