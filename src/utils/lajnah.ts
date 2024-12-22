import { LajnahState } from '@/models/lajnah'
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
): LajnahState | undefined {
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
