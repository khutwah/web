import pages from '@/data/mushaf/pages.json'
import parts from '@/data/mushaf/parts.json'
import surahs from '@/data/mushaf/surahs.json'
import { Page, AyahLocationInfo } from '@/models/mushaf'

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

/**
 * Get the location information of the surah and ayah.
 * @param surah - The surah number.
 * @param ayah - The ayah number.
 * @returns The location information of the surah and ayah.
 */
export function getAyahLocationInfo(
  surah: number,
  ayah: number
): AyahLocationInfo | undefined {
  const page = getPage(surah, ayah)
  if (!page) return undefined

  // Find the juz that contains the page. By comparing page with juz start and end pages.
  const found = parts.juz.find(
    (j) => j.start.page <= page.page && page.page <= j.end.page
  )
  if (!found) return undefined

  const ayahCount = getAyahCount(surah, ayah, found.end.surah, found.end.ayah)
  if (!ayahCount) return undefined

  // Calculate the distance to the end of the juz.
  const distanceToJuzEnd = {
    surah: found.end.surah - surah,
    ayah: ayahCount,
    page: found.end.page - page.page
  }

  return {
    juz: found.id,
    page: page.page,
    distanceToJuzEnd
  }
}

/**
 * Get the number of ayahs between the start and end surah and ayah.
 * @param startSurah - The start surah number.
 * @param startAyah - The start ayah number.
 * @param endSurah - The end surah number.
 * @param endAyah - The end ayah number.
 * @returns The number of ayahs between the start and end surah and ayah.
 */
export function getAyahCount(
  startSurah: number,
  startAyah: number,
  endSurah: number,
  endAyah: number
): number | undefined {
  // If in the same surah, then we just need to consider the ayah distance in that surah.
  if (startSurah === endSurah) {
    return endAyah - startAyah
  }

  const startSurahInfo = surahs.find((surah) => surah.id === startSurah)
  if (!startSurahInfo) return undefined

  const startAyahToStartSurahEnd = startSurahInfo.verses_count - startAyah
  let ayahDistance = 0
  for (let next = startSurah + 1; next < endSurah; next++) {
    const surahInfo = surahs.find((surah) => surah.id === next)
    if (!surahInfo) return undefined
    ayahDistance += surahInfo.verses_count
  }
  return startAyahToStartSurahEnd + endAyah + ayahDistance
}
