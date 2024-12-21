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
