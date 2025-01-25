import { ErrorField } from '@/components/Form/ErrorField'
import { InputWithLabel } from '@/components/Form/InputWithLabel'
import { Eye, EyeClosed } from 'lucide-react'
import { useState } from 'react'
import { FieldError, UseFormRegister } from 'react-hook-form'

type FormData = {
  old_password: string
  new_password: string
  confirm_password: string
}

interface PasswordInputWithToggleProps {
  label: string
  name: keyof FormData
  register: UseFormRegister<FormData>
  error?: FieldError
}

export function PasswordInputWithToggle({
  label,
  name,
  register,
  error
}: PasswordInputWithToggleProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className='relative'>
      <InputWithLabel
        label={label}
        inputProps={{
          ...register(name),
          className: 'w-full pr-10', // Add padding to accommodate the icon
          type: showPassword ? 'text' : 'password',
          placeholder: `Masukkan ${label}`,
          required: false
        }}
      />

      {error && <ErrorField error={error.message} />}

      <button
        type='button'
        onClick={() => setShowPassword(!showPassword)}
        className='absolute right-3 top-12 -translate-y-1/2 text-gray-500 hover:text-gray-700'
      >
        {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
      </button>
    </div>
  )
}
