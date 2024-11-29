'use client'

import { Combobox, ComboboxProps } from '@/components/Form/Combobox'
import { Label } from '@/components/Form/Label'
import { useForm } from 'react-hook-form'
import surah from '@/data/surah.json'

const SURAH_ITEMS = surah.map((s) => ({
  value: String(s.id),
  label: s.name_simple
}))

function getVerseItems(surahValue: string): ComboboxProps['items'] {
  const _surah = surah.find((item) => String(item.id) === surahValue)
  if (!_surah) return []

  return Array.from({ length: _surah.verses_count }, (_, i) => {
    const value = String(i + 1)
    return { value, label: value }
  })
}

export function FormPresence() {
  const { setValue, watch } = useForm({
    defaultValues: {
      start_surah: '',
      start_verse: ''
    }
  })

  const startSurahValue = watch('start_surah', '')
  const startVerseValue = watch('start_verse', '')
  const verseItems = getVerseItems(startSurahValue)

  return (
    <form className='mt-6'>
      <div className='flex flex-row gap-4 items-end'>
        <div className='basis-3/4 flex flex-col gap-2'>
          <Label>Awal Baca</Label>
          <Combobox
            items={SURAH_ITEMS}
            value={startSurahValue}
            onChange={(value) => setValue('start_surah', value)}
            placeholder='Pilih Surah'
            searchPlaceholder='Cari Surah'
          />
        </div>
        <div className='basis-1/4'>
          <Combobox
            items={verseItems}
            value={startVerseValue}
            onChange={(value) => setValue('start_verse', value)}
            placeholder='Pilih Ayat'
            searchPlaceholder='Cari Ayat'
          />
        </div>
      </div>
    </form>
  )
}
