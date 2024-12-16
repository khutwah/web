'use client'

import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { NavbarProps } from '@/models/navbar'

// FIXME(dio): This is a workaround to fix the hydration issue.
const NavbarInternal = dynamic(() => import('./NavbarInternal'), { ssr: false })

export function Navbar({ text, backPath = '/', rightComponent }: NavbarProps) {
  const router = useRouter()

  return (
    <NavbarInternal
      text={text}
      backPath={backPath}
      rightComponent={rightComponent}
      handleBackClick={() => router.replace(backPath)}
    />
  )
}
