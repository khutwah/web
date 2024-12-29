import { SURAH_ITEMS } from '@/models/activity-form'
import { AssessmentRange } from '@/models/assessments'

export interface SurahDetail {
  start_surah: string[]
  start_verse: string[]
  end_surah: string[]
  end_verse: string[]
}

export function parseRangeValue(ranges: AssessmentRange[]) {
  return JSON.stringify(
    ranges.map((range) => [
      `${range.start.surah}:${range.start.verse}`,
      `${range.end.surah}:${range.end.verse}`
    ])
  )
}

export function getAssessmentRangeItems(
  assessmentRanges: Array<{
    id: number
    ranges: AssessmentRange[]
  }>,
  type?: 'juz' | 'surah'
) {
  if (!Array.isArray(assessmentRanges) || assessmentRanges.length === 0) {
    return []
  }

  if (type === 'surah') {
    return SURAH_ITEMS
  }
  return assessmentRanges.map((assessment) => ({
    value: String(assessment.id),
    label: (() => {
      return assessment.ranges
        .map((range) =>
          range.start.juz != range.end.juz
            ? 'Juz ' + range.start.juz + ' - Juz ' + range.end.juz
            : 'Juz ' + range.start.juz
        )
        .join(' dan ')
    })()
  }))
}

export function getAssessmentRangeId(
  sessionType: string | undefined,
  surahRange: string | undefined,
  assessmentRanges: Array<{
    id: number
    ranges: AssessmentRange[]
  }>
) {
  if (!sessionType || !surahRange) {
    return ''
  }

  if (!Array.isArray(assessmentRanges) || assessmentRanges.length === 0) {
    return ''
  }

  const parsedSurahRange = JSON.parse(surahRange)
  const found = assessmentRanges.find((range) => {
    if (parsedSurahRange.length !== range.ranges.length) {
      return false
    }
    for (let i = 0; i < parsedSurahRange.length; i++) {
      const [start, end] = parsedSurahRange[i]
      const rangeEntry = range.ranges[i]

      if (
        start !== `${rangeEntry.start.surah}:${rangeEntry.start.verse}` ||
        end !== `${rangeEntry.end.surah}:${rangeEntry.end.verse}`
      ) {
        return false
      }
    }

    return true
  })

  return found ? String(found.id) : ''
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
