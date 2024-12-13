import { NavbarProps } from '@/models/navbar'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'

export function Navbar(props: NavbarProps) {
  const { text, onClickBackButton, rightComponent } = props
  return (
    <nav
      aria-label='top navigation'
      className='p-4 gap-4 flex items-center text-mtmh-neutral-white bg-mtmh-red-base'
    >
      {onClickBackButton ? (
        <button onClick={onClickBackButton}>
          <ChevronLeftIcon className='size-6 text-mtmh-neutral-white' />
        </button>
      ) : null}
      <h1 className='text-mtmh-title-medium truncate'>{text}</h1>
      {rightComponent ? (
        <div className='size-6 ml-auto'>{rightComponent}</div>
      ) : null}
    </nav>
  )
}
