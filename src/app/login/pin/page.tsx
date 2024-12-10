'use client'

import { PinForm } from './components/PinForm'

export default function Pin() {
  return (
    <div className='flex flex-col items-center justify-center h-full space-y-8'>
      <h2 className='text-mtmh-m-semibold'>Silakan masukkan PIN Anda</h2>
      <PinForm />
    </div>
  )
}
