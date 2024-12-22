import { MistakeCounterType } from '@/models/lajnah'
import { useState } from 'react'
import { Card, CardContent } from '../Card/Card'
import { MistakeCounter } from './MistakeCounter'

export function MistakeCounterStory() {
  const [mistakes, setMistakes] = useState<MistakeCounterType>({
    small: 0,
    medium: 0,
    large: 0
  })

  const handleIncrement = (type: keyof MistakeCounterType) => {
    setMistakes((prev) => ({ ...prev, [type]: prev[type] + 1 }))
  }

  const handleUndo = (type: keyof MistakeCounterType) => {
    setMistakes((prev) => ({ ...prev, [type]: Math.max(0, prev[type] - 1) }))
  }

  return (
    <div className='mx-auto max-w-md p-4'>
      <Card className='mb-8 p-6 shadow-md'>
        <CardContent>
          <div className='flex justify-between'>
            <MistakeCounter
              label='Kecil'
              count={mistakes.small}
              onIncrement={() => handleIncrement('small')}
              onUndo={() => handleUndo('small')}
            />
            <MistakeCounter
              label='Sedang'
              count={mistakes.medium}
              onIncrement={() => handleIncrement('medium')}
              onUndo={() => handleUndo('medium')}
            />
            <MistakeCounter
              label='Besar'
              count={mistakes.large}
              onIncrement={() => handleIncrement('large')}
              onUndo={() => handleUndo('large')}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
