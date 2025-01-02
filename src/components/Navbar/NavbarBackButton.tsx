'use client'

import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

interface NavbarBackButtonProps {
  returnTo?: string
}

export function NavbarBackButton({ returnTo }: NavbarBackButtonProps) {
  const router = useRouter()
  const [isTransitioning] = useTransition()
  return (
    <button
      // If returnTo is provided, use router.replace hence we load the page with new data,
      // otherwise use router.back to take advantage the browser history.
      onClick={returnTo ? () => router.replace(returnTo) : router.back}
      aria-label='Go back'
      disabled={isTransitioning}
    >
      <ChevronLeft className='size-6 text-khutwah-neutral-white' />
    </button>
  )
}
