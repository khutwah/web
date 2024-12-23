import { ComboboxProps } from '@/components/Form/Combobox'
import surah from '@/data/mushaf/surahs.json'

export function getVerseItems(surahValue: number): ComboboxProps['items'] {
  const _surah = surah.find((item) => item.id === surahValue)
  if (!_surah) return []

  return Array.from({ length: _surah.verses_count }, (_, i) => {
    const value = String(i + 1)
    return { value, label: value, searchable: value }
  })
}

export function toggleTag(tags: string[], tag: string) {
  const index = tags.indexOf(tag)

  if (index === -1) {
    return [...(tags || []), tag]
  }
  return tags?.filter((t) => t !== tag) ?? []
}
