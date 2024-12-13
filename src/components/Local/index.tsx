'use client'

import dayjsClientSideLocal from '@/utils/dayjs-client-side-local'

interface LocalDateProps {
  date: string
  format: string
}

export function FormattedLocalDate({ date, format }: LocalDateProps) {
  return <>{dayjsClientSideLocal(date).format(format)}</>
}
