'use client'

import { useFormState } from 'react-dom'
import { logout } from './actions'
import { startTransition, useState } from 'react'
import { Button } from '@/components/Button/Button'
import { Loader2 } from 'lucide-react'

export function LogoutButton() {
  const [, formAction] = useFormState(logout, { message: '' })
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
