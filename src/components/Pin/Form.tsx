'use client'

import { useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import { useActionState, startTransition } from 'react'
import { Button } from '@/components/Button/Button'
import { PinInput } from '@/components/Pin/Input'

interface Payload {
  pin: string
}

interface PinForm {
  buttonText?: string
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  action: (prevState: unknown, formData: FormData) => Promise<any>
  isConfirmationStep?: boolean
}

export function PinForm({ buttonText, action, isConfirmationStep }: PinForm) {
  const [state, formAction] = useActionState(
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    async (previousState: any, formData: FormData) => {
      return action(previousState, formData)
    },
    {
      message: '',
      timestamp: 0
    }
  )

  const { handleSubmit, formState, setValue, watch, reset } = useForm<Payload>({
    defaultValues: { pin: '' }
  })

  const pin = watch('pin')

  const clearPin = useCallback(() => {
    reset({ pin: '' })
  }, [reset])

  useEffect(() => {
    if (state.message === 'mismatch') {
      clearPin()
    }
  }, [state.message, state.timestamp, clearPin])

  useEffect(() => {
    if (isConfirmationStep) {
      clearPin()
    }
  }, [isConfirmationStep, clearPin])

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData()
    formData.set('pin', data.pin)
    startTransition(() => {
      formAction(formData)
    })
  })

  const isSubmitButtonDisabled = pin.length !== 6 || formState.isSubmitting

  const handlePinChange = useCallback(
    (value: string) => {
      const numericValue = value.replace(/\D/g, '')
      setValue('pin', numericValue, {
        shouldValidate: true,
        shouldDirty: true
      })
    },
    [setValue]
  )

  return (
    <form action={formAction} onSubmit={onSubmit} className='space-y-8'>
      <div className='space-y-2'>
        <div className='flex justify-center my-4'>
          <PinInput value={pin} onChange={handlePinChange} />
        </div>
      </div>

      <Button
        type='submit'
        disabled={isSubmitButtonDisabled || formState.isSubmitting}
        className='w-full'
      >
        {formState.isSubmitting ? (
          <>
            <Loader2 className='w-5 h-5 mr-2 animate-spin' />
            Melakukan pengecekan PIN...
          </>
        ) : (
          buttonText
        )}
      </Button>
    </form>
  )
}
