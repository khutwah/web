'use client'

import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface NavbarBackButtonProps {
  returnTo?: string
}

export function NavbarBackButton({ returnTo }: NavbarBackButtonProps) {
  const router = useRouter()
  return (
    <button
      // If returnTo is provided, use router.replace hence we load the page with new data,
      // otherwise use router.back to take advantage the browser history.
      onClick={returnTo ? () => router.replace(returnTo) : router.back}
      aria-label='Go back'
    >
      <ChevronLeft className='size-6 text-mtmh-neutral-white' />
    </button>
  )
}
