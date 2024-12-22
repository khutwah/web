'use client'

import { Button } from '@/components/Button/Button'
import { Undo2 as Undo } from 'lucide-react'

interface MistakeCounterProps {
  label: string
  count: number
  onIncrement: () => void
  onUndo: () => void
}

export function MistakeCounter({
  label,
  count,
  onIncrement,
  onUndo
}: MistakeCounterProps) {
  const getButtonColor = () => {
    if (count === 0) return 'bg-gray-50 hover:bg-yellow-50'
    if (count <= 3) return 'bg-yellow-100 hover:bg-yellow-200'
    if (count <= 6) return 'bg-orange-200 hover:bg-orange-300'
    if (count <= 9) return 'bg-red-300 hover:bg-red-400'
    return 'bg-red-400 hover:bg-red-500'
  }

  return (
    <div className='flex flex-col items-center gap-2'>
      <label className='py-0.5 px-2 rounded-lg border border-dashed border-mtmh-neutral-20 text-mtmh-sm-regular'>
        {label}
      </label>
      <Button
        onClick={onIncrement}
        className={`h-20 w-20 rounded-full text-mtmh-xl-semibold border-2 border-mtmh-neutral-white shadow-md ${getButtonColor()}`}
        variant='outline'
      >
        {count}
      </Button>
      <Button
        onClick={onUndo}
        variant='outline'
        className='h-8 w-8 rounded-full p-0 bg-gray-50 border-2 border-mtmh-neutral-white shadow-md'
        disabled={count === 0}
      >
        <Undo className='h-4 w-4' />
      </Button>
    </div>
  )
}
