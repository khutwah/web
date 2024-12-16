import { ReactNode } from 'react'

export interface NavbarProps {
  text: string
  rightComponent?: ReactNode
  returnTo?: string
}
