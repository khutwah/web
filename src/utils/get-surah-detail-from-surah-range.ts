interface SurahDetail {
  start_surah: string[]
  start_verse: string[]
  end_surah: string[]
  end_verse: string[]
}
export function getSurahDetailFromSurahRange(surahRange?: string): SurahDetail {
  if (!surahRange) {
    return {
      start_surah: [],
      start_verse: [],
      end_surah: [],
      end_verse: []
    }
  }

  const _surahRange = JSON.parse(surahRange) as string[]

  return _surahRange.reduce<SurahDetail>(
    (acc, current) => {
      if (!current) return acc

      const startSurah = current[0]?.split(':') ?? []
      const endSurah = current[1]?.split(':') ?? []
      acc.start_surah.push(startSurah[0] ?? '')
      acc.start_verse.push(startSurah[1] ?? '')
      acc.end_surah.push(endSurah[0] ?? '')
      acc.end_verse.push(endSurah[1] ?? '')

      return acc
    },
    {
      start_surah: [],
      start_verse: [],
      end_surah: [],
      end_verse: []
    }
  )
}
