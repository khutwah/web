import { ComboboxProps } from '@/components/Form/Combobox'
import surah from '@/data/mushaf/surahs.json'

export function getVerseItems(
  surahValue?: number | null,
  minVerse?: number,
  maxVerse?: number
): ComboboxProps['items'] {
  if (!surahValue) return []
  const _surah = surah.find((item) => item.id === surahValue)
  if (!_surah) return []

  const versesCount = _surah.verses_count

  // We can do clever things to handle min-max here.
  // But verbosity matters for debugging later.
  if (minVerse) {
    // minVerse inclusive, hence we add 1.
    return Array.from({ length: versesCount - minVerse + 1 }, (_, i) => {
      const value = String(i + minVerse)
      return { value, label: value, searchable: value }
    })
  }
  if (maxVerse) {
    return Array.from({ length: Math.min(maxVerse, versesCount) }, (_, i) => {
      const value = String(i + 1)
      return { value, label: value, searchable: value }
    })
  }

  return Array.from({ length: versesCount }, (_, i) => {
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
