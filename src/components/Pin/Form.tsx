'use client'

import { useEffect, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CircleAlert, Loader2 } from 'lucide-react'
import { useActionState, startTransition } from 'react'
import { Button } from '@/components/Button/Button'
import { PinInput } from '@/components/Pin/Input'
import { useToast } from '@/hooks/useToast'

interface Payload {
  pin: string
}

interface PinForm {
  buttonText?: string
  action: (prevState: unknown, formData: FormData) => Promise<any>
  isConfirmationStep?: boolean
}

export function PinForm({ buttonText, action, isConfirmationStep }: PinForm) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [, formAction] = useActionState(
    async (previousState: any, formData: FormData) => {
      try {
        const result = await action(previousState, formData)
        if (result?.message && !result.success) {
          toast({
            description: (
              <div className='flex gap-x-4'>
                <CircleAlert />
                <div>{result?.message}</div>
              </div>
            ),
            duration: 5000,
            className: 'p-4 bg-mtmh-error-error text-mtmh-neutral-white'
          })
        }
        return result
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)

        if (errorMessage === 'NEXT_REDIRECT') {
          return { message: '', success: true }
        }
        toast({
          description: (
            <div className='flex gap-x-4'>
              <CircleAlert />
              <div>{errorMessage}</div>
            </div>
          ),
          duration: 5000,
          className: 'p-4 bg-mtmh-error-error text-mtmh-neutral-white'
        })
        return { message: 'An unexpected error occurred', success: false }
      } finally {
        setIsSubmitting(false)
      }
    },
    {
      message: '',
      success: false
    }
  )

  const { handleSubmit, setValue, watch, reset } = useForm<Payload>({
    defaultValues: { pin: '' }
  })

  const pin = watch('pin')

  const clearPin = useCallback(() => {
    reset({ pin: '' })
  }, [reset])

  useEffect(() => {
    if (isConfirmationStep) {
      clearPin()
    }
  }, [isConfirmationStep, clearPin])

  const onSubmit = handleSubmit((data) => {
    setIsSubmitting(true)
    const formData = new FormData()
    formData.set('pin', data.pin)
    startTransition(() => {
      formAction(formData)
    })
  })

  const isSubmitButtonDisabled = pin.length !== 6 || isSubmitting

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
    <form onSubmit={onSubmit} className='space-y-8'>
      <div className='space-y-2'>
        <div className='flex justify-center my-4'>
          <PinInput value={pin} onChange={handlePinChange} />
        </div>
      </div>

      <Button
        type='submit'
        disabled={isSubmitButtonDisabled}
        className='w-full'
      >
        {isSubmitting ? (
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
