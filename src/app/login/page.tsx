'use client'

import { useFormState } from 'react-dom'
import { login } from './actions'
import Image from 'next/image'
import Logo from '@/assets/minhajul-haq-logo.png'
import { InputWithLabel } from '@/components/Form/InputWithLabel'
import { Checkbox } from '@/components/Form/Checkbox'
import Link from 'next/link'

export default function LoginPage() {
  const [state, formAction] = useFormState(login, { message: '' })

  return (
    <main className='pt-12 px-4 pb-6 flex flex-col items-center'>
      <Image alt='Minhajul Haq' src={Logo} width={227} height={65} />

      <div>{state?.message}</div>

      <div className='w-full mt-10 flex flex-col gap-y-10'>
        <form action={formAction} className='w-full flex flex-col gap-y-4'>
          <InputWithLabel
            label='NIS/Email'
            inputProps={{
              id: 'username',
              name: 'username',
              className: 'w-full',
              placeholder: 'Masukkan NIS atau email',
              required: true
            }}
          />

          <div className='flex flex-col gap-y-2'>
            <InputWithLabel
              label='Sandi'
              inputProps={{
                id: 'password',
                name: 'password',
                className: 'w-full',
                type: 'password',
                placeholder: 'Masukkan sandi',
                required: true
              }}
            />

            <div className='flex gap-x-2'>
              <Checkbox id='showPassword' />

              <div className='grid gap-1.5 leading-none'>
                <label
                  htmlFor='showPassword'
                  className='text-mtmh-label peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  Tampilkan sandi
                </label>
              </div>
            </div>
          </div>

          <button className='mt-10'>Masuk</button>
        </form>

        <Link href=''>Lupa sandi?</Link>
      </div>
    </main>
  )
}
