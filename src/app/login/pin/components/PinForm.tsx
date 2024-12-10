'use client'

import { startTransition, useEffect } from 'react'
import { useActionState } from 'react'
import { useForm } from 'react-hook-form'
import { login } from '../actions'
import { useToast } from '@/hooks/useToast'
import { CircleAlert, Loader2 } from 'lucide-react'
import { Button } from '@/components/Button/Button'
import { PinInput } from './PinInput'

interface FormData {
  pin: string
}

export function PinForm() {
  const [state, formAction, isTransitioning] = useActionState(login, {
    message: ''
  })
  const { handleSubmit, formState, setValue, watch } = useForm<FormData>({
    defaultValues: { pin: '' }
  })

  const { toast } = useToast()
  const pin = watch('pin')

  useEffect(() => {
    if (!state?.message || isTransitioning) return

    toast({
      description: (
        <div className='flex gap-x-4'>
          <CircleAlert />

          <div>{state?.message}</div>
        </div>
      ),
      duration: 5000,
      className: 'p-4 bg-mtmh-error-error text-mtmh-neutral-white'
    })
  }, [toast, state?.message, isTransitioning])

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData()
    formData.set('pin', data.pin)

    startTransition(() => {
      formAction(formData)
    })
  })

  const isSubmitButtonDisabled = pin.length !== 6 || formState.isSubmitting

  const handlePinChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '')
    setValue('pin', numericValue, {
      shouldValidate: true,
      shouldDirty: true
    })
  }

  return (
    <form onSubmit={onSubmit} className='space-y-8'>
      <div className='space-y-2'>
        <div className='flex justify-center my-4'>
          <PinInput value={pin} onChange={handlePinChange} />
        </div>
        {/* {formState.errors.pin && (
          <p className="text-sm text-red-500 text-center">{formState.errors.pin.message}</p>
        )} */}
      </div>

      <Button
        type='submit'
        disabled={isSubmitButtonDisabled || isTransitioning}
        className='w-full'
      >
        {isTransitioning ? (
          <>
            <Loader2 className='w-5 h-5 mr-2 animate-spin' />
            Memvalidasi PIN...
          </>
        ) : (
          'Validasi PIN'
        )}
      </Button>
    </form>
  )
}
