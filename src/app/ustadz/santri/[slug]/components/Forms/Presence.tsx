'use client'

import { Combobox, ComboboxProps } from '@/components/Form/Combobox'
import { Label } from '@/components/Form/Label'
import { Control, useForm, useWatch } from 'react-hook-form'
import surah from '@/data/surah.json'
import { Tags } from '@/app/ustadz/santri/[slug]/components/Forms/Tags'

interface ActivityFormValues {
  start_surah: string
  end_surah: string
  start_verse: string
  end_verse: string
  tags: string[]
}

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

function useActivityControlledValue(control: Control<ActivityFormValues>) {
  const values = useWatch({
    control,
    name: ['start_surah', 'end_surah', 'start_verse', 'end_verse', 'tags']
  })

  return {
    startSurah: values[0],
    endSurah: values[1],
    startVerse: values[2],
    endVerse: values[3],
    tags: values[4]
  }
}

function toggleTag(tags: string[], tag: string) {
  const index = tags.indexOf(tag)
  if (index === -1) {
    return [...tags, tag]
  } else {
    return tags.filter((t) => t !== tag)
  }
}

export function FormPresence() {
  const { setValue, control } = useForm<ActivityFormValues>({
    defaultValues: {
      start_surah: '',
      end_surah: '',
      start_verse: '',
      end_verse: '',
      tags: []
    }
  })

  const { startSurah, endSurah, startVerse, endVerse, tags } =
    useActivityControlledValue(control)
  const startVerseItems = getVerseItems(startSurah)
  const endVerseItems = getVerseItems(endSurah)

  const onToggleTag = (tag: string) => {
    setValue('tags', toggleTag(tags, tag))
  }

  return (
    <form className='flex flex-col gap-6 mt-6'>
      <div className='flex flex-row gap-4 items-end'>
        <div className='basis-3/4 flex flex-col gap-2'>
          <Label>Awal Baca</Label>
          <Combobox
            items={SURAH_ITEMS}
            value={startSurah}
            onChange={(value) => setValue('start_surah', value)}
            placeholder='Pilih Surah'
            searchPlaceholder='Cari Surah'
          />
        </div>
        <div className='basis-1/4'>
          <Combobox
            items={startVerseItems}
            value={startVerse}
            onChange={(value) => setValue('start_verse', value)}
            placeholder='Pilih Ayat'
            searchPlaceholder='Cari Ayat'
          />
        </div>
      </div>

      <div className='flex flex-row gap-4 items-end'>
        <div className='basis-3/4 flex flex-col gap-2'>
          <Label>Akhir Baca</Label>
          <Combobox
            items={SURAH_ITEMS}
            value={endSurah}
            onChange={(value) => setValue('end_surah', value)}
            placeholder='Pilih Surah'
            searchPlaceholder='Cari Surah'
          />
        </div>
        <div className='basis-1/4'>
          <Combobox
            items={endVerseItems}
            value={endVerse}
            onChange={(value) => setValue('end_verse', value)}
            placeholder='Pilih Ayat'
            searchPlaceholder='Cari Ayat'
          />
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <Label>Penanda</Label>
        <Tags tags={tags} onClick={onToggleTag} />
      </div>

      <div className='flex flex-col gap-2'>
        <Label>Catatan lain</Label>
      </div>
    </form>
  )
}
