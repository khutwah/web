'use client'

import { DateHeader } from '@/components/Header/Date'
import { useAlAdhanInfo } from '@/hooks/useAlAdhanInfo'

export function SantriActivityHeader() {
  const { alAdhanInfo } = useAlAdhanInfo()

  return <DateHeader hijriDate={alAdhanInfo?.date.hijri} />
}
