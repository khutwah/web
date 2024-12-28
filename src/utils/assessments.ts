import { AssessmentCheckpoint, AssessmentState } from '@/models/assessments'
import per5JuzLajnah from '@/data/lajnah/per-5-juz-lajnah.json'
import { getPageCount } from './mushaf'

/**
 * Get the per 5 juz lajnah state given the surah and ayah.
 * @param surah - The surah number.
 * @param ayah - The ayah number.
 * @returns The per 5 juz lajnah state.
 */
export function getPer5JuzLajnah(
  surah: number,
  ayah: number
): AssessmentState | undefined {
  const currentLajnah = per5JuzLajnah.find(({ checkpoints }) => {
    const { start, end } = checkpoints
    const reverse = end.surah < start.surah
    if (reverse) {
      return (
        (surah < start.surah ||
          (surah === start.surah && ayah >= start.verse)) &&
        (surah > end.surah || (surah === end.surah && ayah <= end.verse))
      )
    }

    return (
      (surah > start.surah || (surah === start.surah && ayah >= start.verse)) &&
      (surah < end.surah || (surah === end.surah && ayah <= end.verse))
    )
  })
  if (!currentLajnah) {
    return undefined
  }
  const { start, end } = currentLajnah.checkpoints
  const pageDistance =
    end.surah < start.surah
      ? getPageCount(end.surah, end.verse, surah, ayah)
      : getPageCount(surah, ayah, end.surah, end.verse)
  return {
    id: currentLajnah.id,
    pageDistance
  }
}

export function parseCheckpointLabel(
  checkpoints: AssessmentCheckpoint | AssessmentCheckpoint[]
) {
  if (Array.isArray(checkpoints)) {
    return checkpoints
      .map((item) => `Juz ${item.start.juz} - Juz ${item.end.juz}`)
      .join(' dan ')
  }
  return `Juz ${checkpoints.start.juz} - Juz ${checkpoints.end.juz}`
}

export function parseCheckpointValue(
  checkpoints: AssessmentCheckpoint | AssessmentCheckpoint[]
) {
  if (Array.isArray(checkpoints)) {
    return JSON.stringify(
      checkpoints.map((item) => [
        `${item.start.surah}:${item.start.verse}`,
        `${item.end.surah}:${item.end.verse}`
      ])
    )
  }
  return JSON.stringify([
    [
      `${checkpoints.start.surah}:${checkpoints.start.verse}`,
      `${checkpoints.end.surah}:${checkpoints.end.verse}`
    ]
  ])
}
