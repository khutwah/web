import pages from '@/data/mushaf/pages.json'
import { Page } from '@/models/mushaf'

/**
 * Get the page object that contains the boundaries of the surah and ayah.
 * @param surah - The surah number.
 * @param ayah - The ayah number.
 * @returns Page object that contains the boundaries.
 */
export function getPage(surah: number, ayah: number): Page | undefined {
  return pages.find((page) => {
    return page.boundaries.some((boundary) => {
      return boundary.surah === surah && ayah <= boundary.ayah
    })
  })
}

/**
 * Get the number of pages between the start and end surah and ayah.
 * @param startSurah - The start surah number.
 * @param startAyah - The start ayah number.
 * @param endSurah - The end surah number.
 * @param endAyah - The end ayah number.
 * @returns
 */
export function getPageCount(
  startSurah: number,
  startAyah: number,
  endSurah: number,
  endAyah: number
): number {
  const startPage = getPage(startSurah, startAyah)
  const endPage = getPage(endSurah, endAyah)
  if (!startPage || !endPage) return 0

  // Simple calculation to get the number of pages between the start and end page.
  return endPage.page - startPage.page + 1
}
