'use client'

import { DateHeader } from '@/components/Header/Date'
import { useAlAdhanInfo } from '@/hooks/useAlAdhanInfo'
import { addQueryParams } from '@/utils/url'
import Link from 'next/link'
import dayjsClientSideLocal from '@/utils/dayjs-client-side-local'
import { ACTIVITY_CURRENT_DATE_QUERY_PARAMETER } from '@/models/activities'
import { useEffect, useState } from 'react'

interface SantriActivityHeaderProps {
  hasJumpToTodayLink?: boolean
}

export function SantriActivityHeader({
  hasJumpToTodayLink
}: SantriActivityHeaderProps) {
  const [href, setHref] = useState<string>('')
  const { alAdhanInfo } = useAlAdhanInfo()
  const currentDate = dayjsClientSideLocal().format('YYYY-MM-DD')

  // To make sure we opt-out of the SSR.
  useEffect(() => {
    setHref(
      addQueryParams(window.location.href, {
        [ACTIVITY_CURRENT_DATE_QUERY_PARAMETER]: currentDate
      })
    )
  }, [])

  return (
    <>
      {hasJumpToTodayLink && href ? (
        <Link href={href}>
          <DateHeader hijriDate={alAdhanInfo?.date.hijri} />
        </Link>
      ) : (
        <DateHeader hijriDate={alAdhanInfo?.date.hijri} />
      )}
    </>
  )
}
