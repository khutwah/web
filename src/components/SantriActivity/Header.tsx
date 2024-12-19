'use client'

import { DateHeader } from '@/components/Header/Date'
import { useAlAdhanInfo } from '@/hooks/useAlAdhanInfo'
import { addQueryParams } from '@/utils/url'
import Link from 'next/link'

interface SantriActivityHeaderProps {
  today?: string
  activated?: boolean
}

export function SantriActivityHeader({
  today,
  activated
}: SantriActivityHeaderProps) {
  const { alAdhanInfo } = useAlAdhanInfo()
  const isActivated = activated && today

  return (
    <>
      {isActivated ? (
        <Link href={addQueryParams(window.location.href, { tanggal: today })}>
          <DateHeader hijriDate={alAdhanInfo?.date.hijri} />
        </Link>
      ) : (
        <DateHeader hijriDate={alAdhanInfo?.date.hijri} />
      )}
    </>
  )
}
