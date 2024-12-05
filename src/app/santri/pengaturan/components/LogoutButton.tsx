'use client'

import { useFormState } from 'react-dom'
import { logout } from '../actions'
import { startTransition } from 'react'
import { Button } from '@/components/Button/Button'

export function LogoutButton() {
  const [, formAction] = useFormState(logout, {
    message: ''
  })

  function onLogout() {
    startTransition(formAction)
  }

  return (
    <Button className='w-full mb-10' variant='primary' onClick={onLogout}>
      Keluar
    </Button>
  )
}
