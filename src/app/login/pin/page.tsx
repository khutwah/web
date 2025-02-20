'use client'

import { PinForm } from '@/components/Pin/Form'
import { login } from './actions'

export default function Pin() {
  return (
    <div className='flex flex-col items-center justify-center h-full space-y-8'>
      <h2 className='text-khutwah-m-semibold'>Silakan masukkan PIN Anda</h2>
      <PinForm action={login} buttonText='Cek PIN' />
    </div>
  )
}
