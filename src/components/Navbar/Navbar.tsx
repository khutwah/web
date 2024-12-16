'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'

interface NavbarProps {
  text: string
  showBackButton?: boolean
  backPath?: string
  rightComponent?: React.ReactNode
}

export function Navbar({ text, backPath = '/', rightComponent }: NavbarProps) {
  const router = useRouter()

  const handleBackClick = () => {
    router.replace(backPath)
  }

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
