'use client'

import { addQueryParams } from '@/utils/url'
import {
  CalendarDays as Grid,
  ChartNoAxesCombined as Chart,
  Loader2
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

export interface ProgressViewToggleProps {
  initialView: 'grid' | 'chart' | undefined
}

export function ProgressViewToggle({ initialView }: ProgressViewToggleProps) {
  const router = useRouter()
  const [progressViewType, setProgressViewType] = useState<'grid' | 'chart'>(
    initialView ?? 'grid'
  )
  const [isPending, startTransition] = useTransition()
  const viewType = progressViewType === 'grid' ? 'chart' : 'grid'
  return (
    <button
      onClick={() => {
        startTransition(() => {
          router.replace(
            addQueryParams(window.location.href, { view: viewType })
          )
          setProgressViewType(viewType)
        })
      }}
      disabled={isPending}
      aria-label={`View ${viewType}`}
    >
      {isPending ? (
        <Loader2 className='animate-spin' />
      ) : progressViewType === 'grid' ? (
        <Chart />
      ) : (
        <Grid />
      )}
    </button>
  )
}
