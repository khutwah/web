'use client'

import { Combobox } from '@/components/Form/Combobox'
import { useRouter, useSearchParams } from 'next/navigation'
import { ComponentProps } from 'react'

type StudentsProps = Readonly<Pick<ComponentProps<typeof Combobox>, 'items'>>

export function Students({ items }: StudentsProps) {
  const router = useRouter()
  const params = useSearchParams()
  const studentId = params.get('student_id')

  return (
    <Combobox
      items={items}
      value={studentId ?? ''}
      onChange={(value) => {
        const newParams = new URLSearchParams(params)
        if (!value) {
          newParams.delete('student_id')
        } else {
          newParams.set('student_id', value)
        }
        router.replace(`?${newParams.toString()}`)
      }}
      placeholder='Cari Santri'
      searchPlaceholder='Cari Santri'
    />
  )
}
