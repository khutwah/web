'use client'

import { useEffect } from 'react'
import { setCookie } from 'cookies-next'

export function TimezoneSetter() {
  useEffect(() => {
    // This feature is wildly available: https://caniuse.com/?search=datetimeformat.
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    setCookie('timezone', timezone, { maxAge: 30 * 24 * 60 * 60 }) // 30 days.
  }, [])

  return null
}
