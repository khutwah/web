import { ComponentProps } from 'react'
import { Input } from './Input'
import { Label } from './Label'

export function InputWithLabel({
  label,
  inputProps
}: {
  label: string
  inputProps: ComponentProps<typeof Input>
}) {
  return (
    <div className='grid w-full items-center gap-2'>
      <Label htmlFor={inputProps.id} className='text-mtmh-title-small'>
        {label}
      </Label>
      <Input {...inputProps} />
    </div>
  )
}
