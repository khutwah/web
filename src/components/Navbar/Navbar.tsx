import { NavbarProps } from '@/models/navbar'
import { NavbarBackButton } from './NavbarBackButton'

export function Navbar(props: NavbarProps) {
  const { text, rightComponent, returnTo } = props
  return (
    <nav
      aria-label='top navigation'
      className='p-4 gap-4 flex items-center text-khutwah-neutral-white bg-khutwah-red-base'
    >
      <NavbarBackButton returnTo={returnTo} />
      <h1 className='text-khutwah-title-medium truncate'>{text}</h1>
      {rightComponent ? (
        <div className='size-6 ml-auto'>{rightComponent}</div>
      ) : null}
    </nav>
  )
}
