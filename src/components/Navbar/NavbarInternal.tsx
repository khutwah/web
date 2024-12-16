import { NavbarPropsWithHandleBackClick } from '@/models/navbar'
import { ChevronLeftIcon } from 'lucide-react'

export default function NavbarInternal({
  text,
  backPath = '/',
  rightComponent,
  handleBackClick
}: NavbarPropsWithHandleBackClick) {
  return (
    <nav
      aria-label='top navigation'
      className='p-4 gap-4 flex items-center text-mtmh-neutral-white bg-mtmh-red-base'
    >
      {backPath && (
        <button onClick={handleBackClick} aria-label='Go back'>
          <ChevronLeftIcon className='size-6 text-mtmh-neutral-white' />
        </button>
      )}
      <h1 className='text-mtmh-title-medium truncate'>{text}</h1>
      {rightComponent && <div className='size-6 ml-auto'>{rightComponent}</div>}
    </nav>
  )
}
