import pages from '@/data/mushaf/pages.json'
import parts from '@/data/mushaf/parts.json'
import surahs from '@/data/mushaf/surahs.json'
import lajnah from '@/data/assessments/lajnah.json'
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

function juzContainsAyah(juzIndex: number, surah: number, ayah: number) {
  const juz = parts.juz[juzIndex]
  if (!juz) return false

  const start = juz.start
  const end = juz.end

  if (surah < start.surah || surah > end.surah) return false
  if (surah === start.surah && ayah < start.ayah) return false
  if (surah === end.surah && ayah > end.ayah) return false

  return true
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
  const foundJuzIndex = parts.juz.findIndex(
    (j) => j.start.page <= page.page && page.page <= j.end.page
  )
  if (!foundJuzIndex) return undefined

  let foundJuz = parts.juz[foundJuzIndex]
  if (
    !juzContainsAyah(foundJuzIndex, surah, ayah) &&
    foundJuzIndex + 1 < parts.juz.length
  ) {
    foundJuz = parts.juz[foundJuzIndex + 1]
  }

  const foundLajnah = lajnah.find(({ parts }) => {
    return parts.some((part) => part === foundJuz.id)
  })
  if (!foundLajnah) return undefined

  const lajnahPartIndex = foundLajnah.parts.findIndex(
    (part) => part === foundJuz.id
  )
  const lajnahRangeIndex = foundLajnah.ranges.findIndex((range) => {
    return range.start.surah <= surah && surah <= range.end.surah
  })

  const numberOfAyahsToEndJuz = getAyahCount(
    surah,
    ayah,
    foundJuz.end.surah,
    foundJuz.end.ayah
  )
  if (numberOfAyahsToEndJuz === undefined) return undefined

  // Calculate the distance to the end of the juz.
  const distanceToJuzEnd = {
    surah: foundJuz.end.surah - surah,
    ayah: numberOfAyahsToEndJuz,
    page: foundJuz.end.page - page.page
  }

  const numberOfAyahsFromStartJuz = getAyahCount(
    foundJuz.start.surah,
    foundJuz.start.ayah,
    surah,
    ayah
  )
  if (numberOfAyahsFromStartJuz === undefined) return undefined

  const distanceFromJuzStart = {
    surah: surah - foundJuz.start.surah,
    ayah: numberOfAyahsFromStartJuz,
    page: page.page - foundJuz.start.page
  }

  const lajnahTotalJuz = foundLajnah.id - lajnahPartIndex
  return {
    juz: foundJuz.id,
    totalJuz: lajnahTotalJuz,
    lajnah: {
      id: foundLajnah.id,
      range: lajnahRangeIndex
    },
    page: page.page,
    distanceToJuzEnd,
    distanceFromJuzStart
  }
}

export function getAyahLocationSummary(surah: number, ayah: number) {
  const location = getAyahLocationInfo(surah, ayah)
  if (!location) return undefined

  const juz = location.totalJuz
  let juzFraction = 0.0
  if (location.distanceToJuzEnd.ayah > 0) {
    juzFraction =
      location.distanceFromJuzStart.ayah /
      (location.distanceToJuzEnd.ayah + location.distanceFromJuzStart.ayah)
  }
  const juzTotal = juz + juzFraction
  const pagesTotal = parts.juz
    .map(({ id, pages }) => {
      return id <= juz ? pages : 0
    })
    .reduce((acc, val) => acc + val, 0)

  return {
    current: {
      juz: location.juz,
      page: location.page
    },
    lajnah: {
      upcoming: location.lajnah.id,
      previous: location.lajnah.id > 0 ? location.lajnah.id - 5 : 0
    },
    juz: {
      juz,
      pages: juzFraction > 0 ? location.distanceFromJuzStart.page : 0,
      total: juzTotal,
      progress: (juzTotal / 30) * 100
    },
    pages:
      pagesTotal + (juzFraction > 0 ? location.distanceFromJuzStart.page : 0)
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

export function parseSurahNameAndAyahFromRangeSegment(
  value: [string] | undefined
) {
  if (!value) return undefined

  const [surahNumber, verseNumber] = value[0].split(':')
  return {
    name: surahs[Number(surahNumber) - 1].name,
    verse: Number(verseNumber)
  }
}

export function getSurahName(surah: number) {
  return surahs.find((entry) => entry.id === surah)?.name
}
