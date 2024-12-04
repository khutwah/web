import dayjs from 'dayjs'
import { InferType, number, object, string } from 'yup'

type SalahPrayerTimeFormat = `${number}:${number}`

const DateDetail = object({
  day: string().required(),
  month: object({
    number: number().required()
  }),
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
    timings: SalahPrayerTimeRecord.required(),
    date: object({
      hijri: DateDetail.nullable()
    })
  }).required()
})

export interface AlAdhanPrayerTimingsResponse
  extends InferType<typeof AlAdhanPrayerTimingsResponse> {}

const DEFAULT_SALAH_PRAYER_TIMES = {
  Fajr: '00:00',
  Sunrise: '00:00',
  Dhuhr: '00:00',
  Asr: '00:00',
  Sunset: '00:00',
  Maghrib: '00:00',
  Isha: '00:00',
  Imsak: '00:00',
  Midnight: '00:00'
} as const

const CURRENT_DATETIME = dayjs()

export const DEFAULT_AL_ADHAN_RESPONSE = {
  timings: DEFAULT_SALAH_PRAYER_TIMES,
  date: {
    gregorian: {
      day: `${CURRENT_DATETIME.day()}`,
      month: {
        en: `${CURRENT_DATETIME.month()}`
      },
      year: `${CURRENT_DATETIME.year()}`
    },
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
