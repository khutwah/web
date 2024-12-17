'use client'

import { addQueryParams } from '@/utils/url'
import {
  CalendarDays as Grid,
  ChartNoAxesCombined as Chart
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function ProgressToggle() {
  const [progressViewType, setProgressViewType] = useState<'grid' | 'chart'>(
    'grid'
  )
  const router = useRouter()
  return (
    <button
      onClick={() => {
        const viewType = progressViewType === 'grid' ? 'chart' : 'grid'
        router.replace(addQueryParams(window.location.href, { view: viewType }))
        setProgressViewType(viewType)
      }}
      aria-label='View type'
    >
      {progressViewType === 'grid' ? (
        <Chart className='size-6 text-mtmh-neutral-white' />
      ) : (
        <Grid className='size-6 text-mtmh-neutral-white' />
      )}
    </button>
  )
}
