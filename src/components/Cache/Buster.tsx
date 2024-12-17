'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { addQueryParams } from '@/utils/url'

export function CacheBuster() {
  const router = useRouter()

  useEffect(() => {
    const buster = new Date().getTime().toString()
    const currentPath = window.location.pathname
    if (
      ['/ustadz', '/santri', '/login', '/'].find((path) => {
        return currentPath.startsWith(path)
      })
    ) {
      const currentSearchParams = new URLSearchParams(window.location.search)
      if (!currentSearchParams.has('b')) {
        router.replace(addQueryParams(window.location.href, { b: buster }))
      }
    }
  }, [router])

  return null
}
