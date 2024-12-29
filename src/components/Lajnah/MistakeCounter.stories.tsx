import { useState } from 'react'
import { Card, CardContent } from '../Card/Card'
import { MistakeCounter } from './MistakeCounter'

export function MistakeCounterStory() {
  const [mistakes, setMistakes] = useState({ small: 0, medium: 0, large: 0 })

  function onChange(type: keyof typeof mistakes, value: number) {
    setMistakes((prev) => ({ ...prev, [type]: value }))
  }

  return (
    <div className='mx-auto max-w-md p-4'>
      <Card className='mb-8 p-6 shadow-md'>
        <CardContent>
          <div className='flex justify-between'>
            <MistakeCounter
              label='Kecil'
              type='small'
              count={mistakes.small}
              onChange={onChange}
            />
            <MistakeCounter
              label='Sedang'
              type='medium'
              count={mistakes.medium}
              onChange={onChange}
            />
            <MistakeCounter
              label='Besar'
              type='large'
              count={mistakes.large}
              onChange={onChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
