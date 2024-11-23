import { ReactNode } from 'react'

export interface NavbarProps {
  onClickBackButton?: () => void
  text: string
  rightComponent?: ReactNode
}
