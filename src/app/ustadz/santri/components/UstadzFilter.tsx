'use client'

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/Form/Select'

import { getUstadzs } from '@/app/actions/ustadz'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { parseSearchParams } from '@/utils/url'
import { Label } from '@/components/Form/Label'

export function UstadzFilter({ selected }: { selected?: number }) {
  const [options, setOptions] = useState<
    Array<{ label: string; value: string }>
  >([])

  useEffect(() => {
    const loadData = async () => {
      const result = await getUstadzs()

      if ('data' in result) {
        setOptions(
          result.data?.map((ustadz) => ({
            label: ustadz.name || '',
            value: String(ustadz.id)
          }))
        )
      }
    }

    loadData()
  }, [])

  return (
    <div className='space-y-2'>
      <Label htmlFor='ustadzId'>Ustadz</Label>
      <Select
        name='ustadzId'
        defaultValue={selected ? String(selected) : undefined}
      >
        <SelectTrigger>
          <SelectValue placeholder='Pilih ustadz' />
        </SelectTrigger>
        <SelectContent>
          {options?.map((option) => (
            <SelectItem value={option.value} key={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
