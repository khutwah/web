import { NavbarProps } from '@/models/navbar'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'

export function Navbar(props: NavbarProps) {
  const { text, withBackButton, onClickBackButton } = props
  return (
    <nav
      aria-label='top navigation'
      className='py-2 px-4 gap-2 flex items-center text-mtmh-neutral-white bg-mtmh-primary-primary'
    >
      {withBackButton && onClickBackButton ? (
        <button onClick={onClickBackButton}>
          <ChevronLeftIcon className='size-6 text-mtmh-neutral-white' />
        </button>
      ) : null}
      <span className='text-mtmh-title-medium'>{text}</span>
    </nav>
  )
}
