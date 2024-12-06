'use client'

import { useFormState } from 'react-dom'
import { login } from './actions'
import { InputWithLabel } from '@/components/Form/InputWithLabel'
import { useForm, useWatch } from 'react-hook-form'
import { startTransition, useEffect } from 'react'
import { useToast } from '@/hooks/useToast'
import { CircleAlert } from 'lucide-react'
import clsx from 'clsx'
import { Button } from '@/components/Button/Button'

export default function Pin() {
  const [state, formAction, isTransitioning] = useFormState(login, {
    message: ''
  })

  const { register, control, formState, handleSubmit } = useForm({
    defaultValues: {
      pin: ''
    }
  })
  const { toast } = useToast()

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

  const onSubmit = handleSubmit((payload) => {
    const formData = new FormData()

    for (const key in payload) {
      formData.set(key, payload[key as keyof typeof payload])
    }

    startTransition(() => {
      formAction(formData)
    })
  })

  const { pin } = useWatch({ control })
  const isSubmitButtonDisabled =
    pin === '' || formState.errors.pin !== undefined

  return (
    <form onSubmit={onSubmit}>
      <InputWithLabel
        label='PIN'
        inputProps={{
          ...register('pin', {
            validate(value) {
              if (value.length < 6) {
                return 'PIN harus berjumlah 6 digit.'
              }

              const isValidNumber = !isNaN(Number(value))
              return isValidNumber ? undefined : 'PIN harus dalam bentuk angka.'
            }
          }),
          id: 'pin',
          className: 'w-full',
          placeholder: 'Masukkan PIN'
        }}
        error={formState.errors.pin?.message}
      />

      <Button
        variant='primary'
        disabled={isSubmitButtonDisabled}
        className='mt-10 w-full'
      >
        Masuk
      </Button>
    </form>
  )
}
