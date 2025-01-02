import { ComponentProps, useId } from 'react'
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
  const id = useId()
  const helperTextId = `:helper-text-${id}:`

  const { className, ...rest } = inputProps

  return (
    <div className='grid w-full items-center gap-2'>
      <Label
        htmlFor={id}
        className={cn(
          'text-khutwah-title-small',
          error && 'text-khutwah-red-light'
        )}
      >
        {label}
      </Label>
      <Input
        {...rest}
        id={id}
        aria-describedby={helperText ? helperTextId : undefined}
        className={cn(className, error && 'border-khutwah-red-light')}
      />

      {helperText && (
        <div
          className='text-khutwah-sm-regular text-khutwah-grey-light'
          id={helperTextId}
        >
          {helperText}
        </div>
      )}
      {error && (
        <div className='text-khutwah-sm-regular text-khutwah-red-light'>
          {error}
        </div>
      )}
    </div>
  )
}
