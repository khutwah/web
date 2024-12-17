'use client'

import { startTransition, useEffect, useState, useActionState } from 'react'
import { login } from './actions'
import { InputWithLabel } from '@/components/Form/InputWithLabel'
import { Checkbox } from '@/components/Form/Checkbox'
import Link from 'next/link'
import { useForm, useWatch } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from '@/components/Dialog/Dialog'
import { useToast } from '@/hooks/useToast'
import { CircleAlert } from 'lucide-react'
import { Button } from '@/components/Button/Button'

export default function LoginPage() {
  const [state, formAction, isTransitioning] = useActionState(login, {
    message: ''
  })
  const { toast } = useToast()

  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      username: '',
      password: ''
    }
  })
  const { username, password } = useWatch({ control })

  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isForgotPasswordDialogOpen, setIsForgotPasswordDialogOpen] =
    useState(false)

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

  const isSubmitButtonDisabled = username === '' || password === ''

  const onSubmit = handleSubmit((payload) => {
    const formData = new FormData()

    for (const key in payload) {
      formData.set(key, payload[key as keyof typeof payload])
    }

    startTransition(() => {
      formAction(formData)
    })
  })

  return (
    <>
      <form onSubmit={onSubmit} className='w-full flex flex-col gap-y-4'>
        <InputWithLabel
          label='NIS/Email'
          inputProps={{
            ...register('username'),
            id: 'username',
            className: 'w-full',
            placeholder: 'Masukkan NIS atau email',
            required: true
          }}
        />

        <div className='flex flex-col gap-y-2'>
          <InputWithLabel
            label='Sandi'
            inputProps={{
              ...register('password'),
              id: 'password',
              className: 'w-full',
              type: isPasswordShown ? 'text' : 'password',
              placeholder: 'Masukkan sandi',
              required: true
            }}
          />

          <div className='flex gap-x-2'>
            <Checkbox
              id='isPasswordShown'
              checked={isPasswordShown}
              onCheckedChange={(checked) =>
                setIsPasswordShown(checked as boolean)
              }
            />

            <div className='grid gap-1.5 leading-none'>
              <label
                htmlFor='isPasswordShown'
                className='text-mtmh-label peer-disabled:cursor-not-allowed peer-disabled:opacity-70 hover:cursor-pointer'
              >
                Tampilkan sandi
              </label>
            </div>
          </div>
        </div>

        <Button
          variant='primary'
          disabled={isSubmitButtonDisabled || isTransitioning}
          className='mt-10'
        >
          {isTransitioning ? (
            <>
              <Loader2 className='w-5 h-5 mr-2 animate-spin' />
              Mencoba masuk...
            </>
          ) : (
            'Masuk'
          )}
        </Button>
      </form>

      <div className='flex flex-col items-center mx-auto'>
        <Dialog
          onOpenChange={setIsForgotPasswordDialogOpen}
          open={isForgotPasswordDialogOpen}
        >
          <DialogTrigger asChild>
            <Link
              href=''
              className='text-mtmh-tamarind-base text-mtmh-body-small underline'
            >
              Lupa sandi?
            </Link>
          </DialogTrigger>
          <DialogContent className='bg-mtmh-neutral-white bottom-0 top-auto !translate-y-0'>
            <DialogHeader>
              <DialogTitle className='flex justify-between border-b border-mtmh-neutral-30 pb-2'>
                Perubahan sandi
              </DialogTitle>
              <DialogDescription className='mt-3'>
                Saat ini, antum dapat menghubungi admin Markaz Tahfizh Minhajul
                Haq melalui WhatsApp untuk melakukan perubahan kata sandi.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className='mt-11'>
              <Button
                variant='primary'
                onClick={() => setIsForgotPasswordDialogOpen(false)}
                className='w-full'
              >
                Hubungi admin
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <label className='text-mtmh-grey-lighter text-mtmh-body-small mt-4'>
          {process.env.NEXT_PUBLIC_APP_VERSION} © {new Date().getFullYear()}
        </label>
      </div>
    </>
  )
}
