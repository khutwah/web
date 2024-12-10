'use client'

import { startTransition, useState, useActionState } from 'react'
import { logout } from './actions'
import { Button } from '@/components/Button/Button'
import { Loader2 } from 'lucide-react'

export function LogoutButton() {
  const [, formAction] = useActionState(logout, { message: '' })
  const [isTransitioning, setIsTransitioning] = useState(false)

  function onLogout() {
    setIsTransitioning(true)
    startTransition(() => {
      formAction()
      setIsTransitioning(false)
    })
  }

  return (
    <Button
      className='w-full mb-10 flex items-center justify-center'
      variant='primary'
      onClick={onLogout}
      disabled={isTransitioning}
    >
      {isTransitioning ? (
        <>
          <Loader2 className='animate-spin mr-2' />
          Mencoba keluar...
        </>
      ) : (
        'Keluar'
      )}
    </Button>
  )
}
