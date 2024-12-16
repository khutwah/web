import { NavbarProps } from '@/models/navbar'
import { NavbarBackButton } from './NavbarBackButton'

export function Navbar(props: NavbarProps) {
  const { text, rightComponent } = props
  return (
    <nav
      aria-label='top navigation'
      className='p-4 gap-4 flex items-center text-mtmh-neutral-white bg-mtmh-red-base'
    >
      <NavbarBackButton />
      <h1 className='text-mtmh-title-medium truncate'>{text}</h1>
      {rightComponent ? (
        <div className='size-6 ml-auto'>{rightComponent}</div>
      ) : null}
    </nav>
  )
}
