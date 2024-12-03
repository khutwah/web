import { InferType, lazy, number, object, ref, string } from 'yup'

export type SalahPrayerTimeFormat = `${number}:${number}`

const SalahPrayerTimeRecord = object({
  imsak: string<SalahPrayerTimeFormat>().required(),
  subuh: string<SalahPrayerTimeFormat>().required(),
  terbit: string<SalahPrayerTimeFormat>().required(),
  dhuha: string<SalahPrayerTimeFormat>().required(),
  dzuhur: string<SalahPrayerTimeFormat>().required(),
  ashar: string<SalahPrayerTimeFormat>().required(),
  maghrib: string<SalahPrayerTimeFormat>().required(),
  isya: string<SalahPrayerTimeFormat>().required()
})

export interface SalahPrayerTimeRecord
  extends InferType<typeof SalahPrayerTimeRecord> {}

const SalahPrayerTimeByDateRecord = lazy((value) =>
  object(
    Object.keys(value || {}).reduce(
      (acc, key) => {
        acc[key] = SalahPrayerTimeRecord
        return acc
      },
      {} as Record<string, typeof SalahPrayerTimeRecord>
    )
  )
)

export const SalahPrayerTimeResponse = object({
  status: number().required(),
  // For example: 'Success'.
  message: string().required(),
  // For example: 'JAWA BARAT'.
  prov: string().required(),
  // For example: 'KAB. PURWAKARTA'.
  kabko: string().required(),
  data: SalahPrayerTimeByDateRecord
})
