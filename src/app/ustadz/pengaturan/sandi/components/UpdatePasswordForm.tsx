import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@/components/Button/Button'
import { PasswordInputWithToggle } from './PasswordInputWithToggle'
import { UpdatePasswordSchema } from '@/models/password'
import { startTransition, useActionState } from 'react'
import { UpdatePasswordProps } from '../models/update-password'
import { useErrorToast } from '@/hooks/useToast'

type ActionState = { message?: string } | undefined

export function UpdatePasswordForm({ action }: UpdatePasswordProps) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    action,
    {}
  )
  useErrorToast(state?.message, isPending)

  const form = useForm({
    resolver: yupResolver(UpdatePasswordSchema),
    defaultValues: {
      old_password: '',
      new_password: '',
      confirm_password: ''
    }
  })

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = form

  const onSubmit = handleSubmit((payload) => {
    const formData = new FormData()

    for (const key in payload) {
      const value = payload[key as keyof typeof payload]!
      formData.set(key, value.toString())
    }

    startTransition(() => {
      formAction(formData)
    })
  })

  return (
    <FormProvider {...form}>
      <form
        onSubmit={onSubmit}
        className='flex flex-col gap-6 pb-8 px-4 pt-2 overflow-auto'
      >
        <div>
          <PasswordInputWithToggle
            label='Sandi Saat Ini'
            name='old_password'
            register={register}
            error={errors.old_password}
          />
        </div>

        <div>
          <PasswordInputWithToggle
            label='Sandi Baru'
            name='new_password'
            register={register}
            error={errors.new_password}
          />
        </div>

        <div>
          <PasswordInputWithToggle
            label='Konfirmasi Sandi Baru'
            name='confirm_password'
            register={register}
            error={errors.confirm_password}
          />
        </div>

        <div>
          <Button
            type='submit'
            variant='primary'
            className='w-full mt-4'
            disabled={isPending}
          >
            {isPending ? 'Mengubah Sandi...' : 'Ubah Sandi'}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
