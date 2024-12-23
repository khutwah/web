export interface Page {
  page: number
  boundaries: { surah: number; ayah: number }[]
}

export interface AyahLocationInfo {
  juz: number
  page: number

  // All of the following numbers are independent from each other.
  // surah tells the surah difference, while ayah and page tells the ayah and page difference respectively.
  distanceToJuzEnd: {
    surah: number
    ayah: number
    page: number
  }
}
