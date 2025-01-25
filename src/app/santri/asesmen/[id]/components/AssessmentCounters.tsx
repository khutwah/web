'use client'

import { MistakeCounter } from '@/components/Assesment/MistakeCounter'

interface AssessmentCountersProps {
  mistakes?: {
    low: number
    high: number
  }
}

export function AssessmentCounters({ mistakes }: AssessmentCountersProps) {
  return (
    <div className='flex justify-between gap-x-6'>
      <MistakeCounter
        label='لحن خفي'
        type='low'
        count={mistakes?.low || 0}
        onChange={() => {}}
        readOnly
      />

      <MistakeCounter
        label='لحن جلي'
        type='high'
        count={mistakes?.high || 0}
        onChange={() => {}}
        readOnly
      />
    </div>
  )
}
