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
import { Label } from '@/components/Form/Label'
import { Controller, useFormContext } from 'react-hook-form'

export function UstadzFilter() {
  const [options, setOptions] = useState<
    Array<{ label: string; value: string }>
  >([])

  const { control } = useFormContext()

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

      <Controller
        control={control}
        name='ustadzId'
        render={({ field }) => {
          return (
            <Select
              onValueChange={(val) => field.onChange(Number(val))}
              value={field.value ? String(field.value) : undefined}
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
          )
        }}
      />
    </div>
  )
}
