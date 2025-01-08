import { SURAH_ITEMS } from '@/models/activity-form'
import { AssessmentRange } from '@/models/assessments'
import lajnahAssessments from '@/data/assessments/lajnah.json'
import { getAyahLocationSummary } from './mushaf'
import { CheckpointStatus } from '@/models/checkpoints'

export interface SurahDetail {
  start_surah: string[]
  start_verse: string[]
  end_surah: string[]
  end_verse: string[]
}

export function checkSurahDetail(surahDetail: SurahDetail) {
  return isSurahDetailFilled(surahDetail) ? 0 : undefined
}

function isSurahDetailFilled(surahDetail: SurahDetail) {
  return (
    // Currently, we only have one range.
    surahDetail.start_surah[0] &&
    surahDetail.start_verse[0] &&
    surahDetail.end_surah[0] &&
    surahDetail.end_verse[0]
  )
}

export function customSurahRangeSessionName(
  startSurah: string | undefined,
  startVerse: string | undefined,
  endSurah: string | undefined,
  endVerse: string | undefined
) {
  const start = SURAH_ITEMS.find(({ value }) => value === startSurah)
  const end = SURAH_ITEMS.find(({ value }) => value === endSurah)
  return `${start?.label}: ${startVerse} - ${end?.label}: ${endVerse}`
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

const lajnahJuzCheckpoints = lajnahAssessments.map(({ id }) => id)
export function getNextLajnahAssessment(
  surah?: number | null,
  verse?: number | null
) {
  if (!surah || !verse) return undefined

  const summary = getAyahLocationSummary(surah, verse)
  if (!summary) return undefined

  const currentCheckpoint = summary.juz.total

  // Find the next checkpoint that is greater than the current one
  const nextCheckpoint = lajnahJuzCheckpoints.find(
    (checkpoint) => checkpoint > currentCheckpoint
  )

  // If no next checkpoint, return the last one
  return nextCheckpoint ?? lajnahJuzCheckpoints[lajnahJuzCheckpoints.length - 1]
}

export function getStatusText(status: CheckpointStatus) {
  switch (status) {
    case 'assessment-ongoing':
      return 'Sedang Ikhtibar'
    case 'lajnah-assessment-ongoing':
      return 'Sedang Ikhtibar Lajnah'
    case 'lajnah-assessment-ready':
      return 'Siap Ikhtibar Lajnah'
    default:
      return undefined
  }
}
