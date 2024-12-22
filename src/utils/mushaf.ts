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
 * Get the next page object.
 * @param currentPageNumber - The current page number.
 * @returns Page object that contains the boundaries.
 */
export function getNextPage(currentPageNumber: number): Page | undefined {
  return pages.find((page) => page.page === currentPageNumber + 1)
}

/**
 * Get the number of pages between the start and end surah and ayah.
 * @param startSurah - The start surah number.
 * @param startAyah - The start ayah number.
 * @param endSurah - The end surah number.
 * @param endAyah - The end ayah number.
 * @returns The number of pages between the start and end surah and ayah.
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

/**
 * Get the end surah and ayah given the start surah, start ayah, page count, and boundary preference.
 * @param startSurah - The start surah number.
 * @param startAyah - The start ayah number.
 * @param pageCount - The number of pages.
 * @param useLastBoundary - Whether to use the last boundary (default) or the first boundary on the end page.
 * @returns An object containing endSurah and endAyah.
 */
export function getEndSurahAndAyah(
  startSurah: number,
  startAyah: number,
  pageCount: number,
  useLastBoundary: boolean = true
): { surah: number; ayah: number; pageNumber: number } | undefined {
  const startPage = getPage(startSurah, startAyah)
  if (!startPage) return undefined

  const endPageNumber = startPage.page + pageCount - 1
  const endPage = pages.find((page) => page.page === endPageNumber)
  if (!endPage) return undefined

  // Choose the boundary based on the preference.
  const boundary = useLastBoundary
    ? endPage.boundaries[endPage.boundaries.length - 1] // Last boundary.
    : endPage.boundaries[0] // First boundary.

  return {
    surah: boundary.surah,
    ayah: boundary.ayah,
    pageNumber: endPageNumber
  }
}
