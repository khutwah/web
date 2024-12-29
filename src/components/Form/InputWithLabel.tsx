import { ComponentProps } from 'react'
import { Input } from './Input'
import { Label } from './Label'
import { cn } from '@/utils/classnames'

export function InputWithLabel({
  label,
  inputProps,
  error,
  helperText
}: {
  label: string
  inputProps: ComponentProps<typeof Input>
  error?: string
  helperText?: string
}) {
  const { className, ...rest } = inputProps

  return (
    <div className='grid w-full items-center gap-2'>
      <Label
        htmlFor={inputProps.id}
        className={cn('text-mtmh-title-small', error && 'text-mtmh-red-light')}
      >
        {label}
      </Label>
      <Input
        {...rest}
        className={cn(className, error && 'border-mtmh-red-light')}
      />

      {helperText && (
        <div className='text-mtmh-sm-regular text-mtmh-grey-light'>
          {helperText}
        </div>
      )}
      {error && (
        <div className='text-mtmh-sm-regular text-mtmh-red-light'>{error}</div>
      )}
    </div>
  )
}
