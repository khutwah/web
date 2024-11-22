'use client'

import { useFormState } from 'react-dom'
import { login } from './actions'
import Image from 'next/image'
import Logo from '@/assets/minhajul-haq-logo.png'
import { InputWithLabel } from '@/components/Form/InputWithLabel'
import { Checkbox } from '@/components/Form/Checkbox'
import Link from 'next/link'
import { useForm, useWatch } from 'react-hook-form'
import classNames from 'clsx'
import { startTransition, useEffect, useState } from 'react'
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

export default function LoginPage() {
  const [state, formAction, isTransitioning] = useFormState(login, {
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
    <main className='pt-12 px-4 pb-6 flex flex-col items-center'>
      <Image alt='Minhajul Haq' src={Logo} width={227} height={65} />

      <div className='w-full mt-10 flex flex-col gap-y-10'>
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

          <button
            disabled={isSubmitButtonDisabled}
            className={classNames(
              'mt-10 py-2 px-4 rounded-md text-mtmh-button-large !text-center text-mtmh-neutral-white',
              {
                'bg-mtmh-neutral-40': isSubmitButtonDisabled,
                'bg-mtmh-primary-primary': !isSubmitButtonDisabled
              }
            )}
          >
            Masuk
          </button>
        </form>

        <div className='text-center'>
          <Dialog
            onOpenChange={setIsForgotPasswordDialogOpen}
            open={isForgotPasswordDialogOpen}
          >
            <DialogTrigger asChild>
              <Link
                href=''
                className='text-mtmh-secondary-secondary text-mtmh-body-small underline'
              >
                Lupa sandi?
              </Link>
            </DialogTrigger>
            <DialogContent className='bg-mtmh-neutral-white bottom-0 top-auto !translate-y-0'>
              <DialogHeader>
                <DialogTitle className='flex justify-between border-b border-mtmh-neutral-30 pb-2'>
                  Perubahan sandi
                </DialogTitle>
                <DialogDescription className='!mt-3'>
                  Saat ini, Anda dapat menghubungi admin Markaz Tahfizh Minhajul
                  Haq melalui WhatsApp untuk melakukan perubahan kata sandi.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className='mt-[44px]'>
                <button
                  className='w-full py-2 px-4 rounded-md text-mtmh-button-large !text-center text-mtmh-neutral-white bg-mtmh-primary-primary'
                  onClick={() => setIsForgotPasswordDialogOpen(false)}
                >
                  Hubungi admin
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </main>
  )
}
