interface VersesByKeyResult {
  verse: {
    id: number
    verse_number: number
    verse_key: string
    hizb_number: number
    rub_el_hizb_number: number
    ruku_number: number
    manzil_number: number
    sajdah_number: number | null
    page_number: number
    juz_number: number
  }
}
export async function getVersesByKey(
  key: string
): Promise<VersesByKeyResult | null> {
  try {
    const response = await fetch(
      `https://api.quran.com/api/v4/verses/by_key/${key}`
    )
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    return await response.json()
  } catch (error) {
    console.error(error)
    return null
  }
}
