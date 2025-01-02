'use client'

import { useState, useCallback } from 'react'
import { PinForm } from '@/components/Pin/Form'
import { action } from './actions'

export default function PinPage() {
  const [step, setStep] = useState<'initial' | 'confirmation'>('initial')
  const [initialPin, setInitialPin] = useState('')

  const handleInitialSubmit = useCallback(
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    async (_: any, formData: FormData) => {
      const pin = formData.get('pin') as string
      setInitialPin(pin)
      setStep('confirmation')
      return { message: '', timestamp: Date.now() }
    },
    []
  )

  const handleConfirmationSubmit = useCallback(
    async (_prev: unknown, formData: FormData) => {
      const confirmedPin = formData.get('pin') as string
      if (confirmedPin === initialPin) {
        return action(_prev, formData)
      } else {
        return {
          message: 'PIN tidak cocok. Silakan coba lagi.',
          success: false
        }
      }
    },
    [initialPin]
  )

  return (
    <div className='flex flex-col items-center justify-center h-full space-y-8'>
      <h2 className='text-khutwah-m-semibold'>
        {step === 'initial'
          ? 'Amankan akun Anda dengan PIN'
          : 'Konfirmasi PIN Anda'}
      </h2>
      <PinForm
        action={
          step === 'initial' ? handleInitialSubmit : handleConfirmationSubmit
        }
        buttonText={step === 'initial' ? 'Lanjutkan' : 'Konfirmasi PIN'}
        isConfirmationStep={step === 'confirmation'}
      />
    </div>
  )
}
