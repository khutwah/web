'use client'

import { Button } from '@/components/Button/Button'
import { useRouter } from 'next/navigation'

export function ReloadButton() {
  const router = useRouter()
  return (
    <Button type='button' size='sm' onClick={() => router.refresh()}>
      Muat ulang
    </Button>
  )
}
