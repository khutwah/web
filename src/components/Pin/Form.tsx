'use client'

import { useEffect, useCallback } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { CircleAlert, Loader2 } from 'lucide-react'
import { useActionState, startTransition } from 'react'
import { Button } from '@/components/Button/Button'
import { PinInput } from '@/components/Pin/Input'
import { useToast } from '@/hooks/useToast'

interface Payload {
  pin: string
}

interface PinForm {
  buttonText: string
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  action: (prevState: unknown, formData: FormData) => Promise<any>
  isConfirmationStep?: boolean
}

export function PinForm({ buttonText, action, isConfirmationStep }: PinForm) {
  const [state, formAction, isTransitioning] = useActionState(action, {
    message: ''
  })
  const { toast } = useToast()

  const { control, handleSubmit, setValue, reset } = useForm<Payload>({
    defaultValues: { pin: '' }
  })

  const { pin } = useWatch({ control })

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
      className: 'p-4 bg-khutwah-error-error text-khutwah-neutral-white'
    })
  }, [toast, state?.message, isTransitioning])

  const isSubmitButtonDisabled = pin?.length !== 6 || isTransitioning

  const onSubmit = handleSubmit((payload) => {
    const formData = new FormData()

    for (const key in payload) {
      formData.set(key, payload[key as keyof typeof payload])
    }

    startTransition(() => {
      formAction(formData)
    })
  })

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

  const clearPin = useCallback(() => {
    reset({ pin: '' })
  }, [reset])

  useEffect(() => {
    if (isConfirmationStep) {
      clearPin()
    }
  }, [isConfirmationStep, clearPin])

  return (
    <>
      <form onSubmit={onSubmit} className='space-y-8'>
        <div className='space-y-2'>
          <div className='flex justify-center my-4'>
            <PinInput value={pin || ''} onChange={handlePinChange} />
          </div>
        </div>
        <Button
          variant='primary'
          disabled={isSubmitButtonDisabled}
          className='w-full'
        >
          {isTransitioning ? (
            <>
              <Loader2 className='w-5 h-5 mr-2 animate-spin' />
              Mencoba masuk...
            </>
          ) : (
            buttonText
          )}
        </Button>
      </form>
    </>
  )
}
