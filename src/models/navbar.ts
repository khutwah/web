export interface NavbarProps {
  text: string
  showBackButton?: boolean
  backPath?: string
  rightComponent?: React.ReactNode
}

export type NavbarPropsWithHandleBackClick = NavbarProps & {
  handleBackClick: React.MouseEventHandler<HTMLButtonElement>
}
