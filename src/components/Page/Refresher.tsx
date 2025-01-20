'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'
import { fetchEventSource } from '@microsoft/fetch-event-source'

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
  const controllerRef = useRef<AbortController | null>(null)

  const handleEvent = useCallback(
    (event: { data: string }) => {
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
    },
    [refreshDelay, router]
  )

  useEffect(() => {
    controllerRef.current = new AbortController()

    const startEventSource = async () => {
      try {
        await fetchEventSource(endpoint, {
          signal: controllerRef.current?.signal,
          onmessage(event) {
            handleEvent(event)
          }
        })
      } catch (error) {
        console.error('Failed to establish connection:', error)
      }
    }

    startEventSource()

    return () => {
      controllerRef.current?.abort()
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [endpoint, handleEvent])

  return null
}
