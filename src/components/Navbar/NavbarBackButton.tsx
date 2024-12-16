'use client'

import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function NavbarBackButton() {
  const router = useRouter()
  return (
    <button onClick={router.back} aria-label='Go back'>
      <ChevronLeft className='size-6 text-mtmh-neutral-white' />
    </button>
  )
}
