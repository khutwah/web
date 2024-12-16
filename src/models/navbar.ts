import { ReactNode } from 'react'

export interface NavbarProps {
  onClickBackButton?: (searchParams: {
    [key: string]: string | string[] | undefined
  }) => void
  searchParams?: { [key: string]: string | string[] | undefined }
  text: string
  rightComponent?: ReactNode
}
