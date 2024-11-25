export type SalahPrayerTimeFormat = `${number}:${number}`

export type SalahPrayerTimeRecord = Record<
  | 'imsak'
  | 'subuh'
  | 'terbit'
  | 'dhuha'
  | 'dzuhur'
  | 'ashar'
  | 'maghrib'
  | 'isya',
  SalahPrayerTimeFormat
>
