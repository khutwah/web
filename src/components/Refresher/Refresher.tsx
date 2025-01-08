'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'

interface RefresherProps {
  endpoint: string
}

export default function Refresher({ endpoint }: RefresherProps) {
  const router = useRouter()
  const debouncedRefresh = useDebouncedCallback(router.refresh, 200)
  useEffect(() => {
    const eventSource = new EventSource(endpoint)
    eventSource.addEventListener('message', () => {
      debouncedRefresh()
    })
    return () => {
      eventSource.close()
    }
  }, [router, debouncedRefresh, endpoint])
  return null
}
