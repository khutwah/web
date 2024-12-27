export interface Page {
  page: number
  boundaries: { surah: number; ayah: number }[]
}

export interface AyahLocationInfo {
  juz: number
  totalJuz: number
  page: number
  lajnah: {
    id: number
    range: number
  }

  // All of the following numbers are independent from each other.
  // surah tells the surah difference, while ayah and page tells the ayah and page difference respectively.
  distanceToJuzEnd: {
    surah: number
    ayah: number
    page: number
  }
  distanceFromJuzStart: {
    surah: number
    ayah: number
    page: number
  }
}
