import {
  SalahPrayerTimeRecord,
  SalahPrayerTimeResponse
} from '@/models/api/salah-prayer-times'
import dayjsGmt7 from '../dayjs-gmt7'

const PURWAKARTA_LATLONG = {
  x: 'c20ad4d76fe97759aa27a0c99bff6710',
  y: '38af86134b65d0f10fe33d30dd76442e'
}
const DEFAULT_SALAH_PRAYER_TIMES = {
  imsak: '00:00',
  subuh: '00:00',
  terbit: '00:00',
  dhuha: '00:00',
  dzuhur: '00:00',
  ashar: '00:00',
  maghrib: '00:00',
  isya: '00:00'
} as const

export async function getSalahPrayerTimes(): Promise<SalahPrayerTimeRecord> {
  const currentDateTime = dayjsGmt7()

  // Get the cookie first.
  let response = await fetch('https://bimasislam.kemenag.go.id/jadwalshalat')
  const rawCookie = decodeURIComponent(response.headers.get('set-cookie') ?? '')
  const rawCookieArray = rawCookie.split('; ')

  const rawSessionCookie =
    rawCookieArray.find((cookie) => cookie.startsWith('bimasislam_session=')) ??
    ''
  const sessionCookie = rawSessionCookie.split('; ')[0]
  console.info(rawSessionCookie)

  response = await fetch('https://bimasislam.kemenag.go.id/ajax/getShalatbln', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Cookie: sessionCookie ?? ''
    },
    body: JSON.stringify({
      ...PURWAKARTA_LATLONG,
      bln: `${currentDateTime.month() + 1}`,
      thn: `${currentDateTime.year()}`
    })
  })

  if (!response.ok) {
    console.error(response.statusText)
    return DEFAULT_SALAH_PRAYER_TIMES
  }

  console.info(await response.text())

  try {
    const json = await response.json()
    console.info(json)
    const parsed = await SalahPrayerTimeResponse.validate(json)
    const formatted = currentDateTime.format('YYYY-MM-DD')
    const todaySalahPrayerTimes = parsed.data[formatted]

    if (!todaySalahPrayerTimes) {
      throw new Error(
        `There is no salah prayer time key ${formatted}. Available ones are: ${Object.keys(json.data).join(', ')}.`
      )
    }

    return todaySalahPrayerTimes
  } catch (err) {
    console.error(err)
    return DEFAULT_SALAH_PRAYER_TIMES
  }
}
