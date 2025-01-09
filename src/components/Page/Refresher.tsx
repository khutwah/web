'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

interface RefresherProps {
  endpoint?: string
  refreshDelay?: number // Delay for queue coalescing
}

export function Refresher({
  endpoint = '/api/v1/generic/stream',
  refreshDelay = 200
}: RefresherProps) {
  const router = useRouter()

  const queueRef = useRef<string[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const handleEvent = (event: MessageEvent) => {
    queueRef.current.push(event.data)

    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(() => {
      if (queueRef.current.length > 0) {
        router.refresh()
        queueRef.current = []
      }

      timerRef.current = null
    }, refreshDelay)
  }

  useEffect(() => {
    const eventSource = new EventSource(endpoint)
    eventSource.addEventListener('message', handleEvent)

    return () => {
      eventSource.close()
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [endpoint, refreshDelay, router])

  return null
}
