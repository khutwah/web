import { ComponentType, SVGProps } from 'react'

interface BottomNavbarLink {
  text: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  href: string
  active: boolean
}

export interface BottomNavbarProps {
  links: BottomNavbarLink[]
}
