import React, { useRef, KeyboardEvent, useCallback } from 'react'
import { Input } from '@/components/Form/Input'

interface PinInputProps {
  onChange: (value: string) => void
  value: string
}

export function PinInput({ onChange, value }: PinInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, inputValue: string) => {
    const newValue = value.split('')
    newValue[index] = inputValue
    const updatedValue = newValue.join('')
    onChange(updatedValue)

    if (inputValue && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6)
    const newValue = pastedData.replace(/\D/g, '')
    onChange(newValue)

    const lastFilledIndex = Math.min(newValue.length - 1, 5)
    inputRefs.current[lastFilledIndex]?.focus()
  }

  const inputRefCallback = useCallback(
    (index: number) => (el: HTMLInputElement | null) => {
      inputRefs.current[index] = el
    },
    []
  )

  return (
    <div className='flex space-x-4' onPaste={handlePaste}>
      {[...Array(6)].map((_, index) => (
        <Input
          key={index}
          type='text'
          inputMode='numeric'
          pattern='\d*'
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          ref={inputRefCallback(index)}
          className='w-12 h-12 text-center text-2xl'
        />
      ))}
    </div>
  )
}
