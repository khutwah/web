import { InferType, number, object, string } from 'yup'

type SalahPrayerTimeFormat = `${number}:${number}`

const DateDetail = object({
  // DD format, e.g. 01-31.
  day: string().required(),
  month: object({
    // M format, e.g. 1-12.
    number: number().required()
  }),
  // YYYY format, e.g. 2024.
  year: string().required()
})

const SalahPrayerTimeRecord = object({
  Fajr: string<SalahPrayerTimeFormat>().required(),
  Sunrise: string<SalahPrayerTimeFormat>().required(),
  Dhuhr: string<SalahPrayerTimeFormat>().required(),
  Asr: string<SalahPrayerTimeFormat>().required(),
  Sunset: string<SalahPrayerTimeFormat>().required(),
  Maghrib: string<SalahPrayerTimeFormat>().required(),
  Isha: string<SalahPrayerTimeFormat>().required(),
  Imsak: string<SalahPrayerTimeFormat>().required(),
  Midnight: string<SalahPrayerTimeFormat>().required()
})

interface SalahPrayerTimeRecord
  extends InferType<typeof SalahPrayerTimeRecord> {}

export const AlAdhanPrayerTimingsResponse = object({
  code: number().required(),
  // For example: 'OK'.
  status: string().required(),
  data: object({
    timings: SalahPrayerTimeRecord.nullable(),
    date: object({
      hijri: DateDetail.nullable()
    })
  }).required()
})

export interface AlAdhanPrayerTimingsResponse
  extends InferType<typeof AlAdhanPrayerTimingsResponse> {}

export const DEFAULT_AL_ADHAN_RESPONSE: AlAdhanPrayerTimingsResponse['data'] = {
  timings: null,
  date: {
    // In case something happens with the fetch, we revert to `null` and not render the Hijri date.
    hijri: null
  }
}

export const HIJRI_MONTH_NUMBER_TO_TEXT_RECORD: Record<number, string> = {
  1: 'Muharram',
  2: 'Safar',
  3: "Rabi'ul Awal",
  4: "Rabi'ul Akhir",
  5: 'Jumadil Awal',
  6: 'Jumadil Akhir',
  7: 'Rajab',
  8: "Sya'ban",
  9: 'Ramadhan',
  10: 'Syawal',
  11: "Dzulqa'dah",
  12: 'Dzulhijjah'
}
