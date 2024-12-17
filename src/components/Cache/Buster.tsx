'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { addQueryParams } from '@/utils/url'

// CacheBuster is a component that will add a query parameter to the URL.
// This is useful to force the browser to fetch the latest version of the page.
// And this is controlled by the environment variable `NEXT_PUBLIC_CACHE_BUSTER` at build time.
export function CacheBuster() {
  const buster = process.env.NEXT_PUBLIC_CACHE_BUSTER
  if (!buster) return null

  const router = useRouter()

  useEffect(() => {
    const currentPath = window.location.pathname
    if (
      ['/ustadz', '/santri', '/login', '/'].find((path) => {
        return currentPath.startsWith(path)
      })
    ) {
      const currentSearchParams = new URLSearchParams(window.location.search)
      if (!currentSearchParams.has('v')) {
        router.replace(addQueryParams(window.location.href, { v: buster }))
      }
    }
  }, [router])

  return null
}
