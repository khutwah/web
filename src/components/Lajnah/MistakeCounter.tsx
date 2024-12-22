'use client'

import { Button } from '@/components/Button/Button'
import { MistakeCounterType } from '@/models/lajnah'
import { Undo2 as Undo } from 'lucide-react'

interface MistakeCounterProps {
  label: string
  count: number
  type: keyof MistakeCounterType
  onIncrement: (type: keyof MistakeCounterType) => void
  onUndo: (type: keyof MistakeCounterType) => void
}

export function MistakeCounter({
  label,
  count,
  type,
  onIncrement,
  onUndo
}: MistakeCounterProps) {
  const getButtonColor = () => {
    if (count === 0)
      return 'bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200'
    if (count <= 3)
      return 'bg-gradient-to-br from-yellow-100 to-yellow-200 hover:from-yellow-200 hover:to-yellow-300'
    if (count <= 6)
      return 'bg-gradient-to-br from-orange-200 to-orange-300 hover:from-orange-300 hover:to-orange-400'
    if (count <= 9)
      return 'bg-gradient-to-br from-red-300 to-red-400 hover:from-red-400 hover:to-red-500'
    return 'bg-gradient-to-br from-red-400 to-red-500 hover:from-red-600 hover:to-red-700'
  }

  return (
    <div className='flex flex-col items-center gap-2'>
      <label className='py-0.5 px-2 rounded-lg border border-dashed border-mtmh-neutral-20 text-mtmh-sm-regular'>
        {label}
      </label>
      <Button
        onClick={() => {
          onIncrement(type)
        }}
        className={`h-20 w-20 rounded-full text-mtmh-xl-semibold border-2 border-mtmh-neutral-white shadow-md ${getButtonColor()}`}
        variant='outline'
      >
        {count}
      </Button>
      <Button
        onClick={() => {
          onUndo(type)
        }}
        variant='outline'
        className='h-8 w-8 rounded-full p-0 bg-gray-50 border-2 border-mtmh-neutral-white shadow-md'
        disabled={count === 0}
      >
        <Undo className='h-4 w-4' />
      </Button>
    </div>
  )
}
