import pages from '@/data/mushaf/pages.json'
import { Page } from '@/models/mushaf'

/**
 * Get the page object that contains the boundaries of the surah and ayah.
 * @param surahAyah surah and ayah in the format of 'surah:ayah'
 * @returns Page object that contains the boundaries.
 */
export function getPage(surahAyah: string): Page | undefined {
  return pages.find((page) => {
    return page.boundaries.some((boundary) => {
      const [surah, ayah] = surahAyah.split(':')
      return boundary.surah === Number(surah) && Number(ayah) <= boundary.ayah
    })
  })
}
