import {
  AlAdhanPrayerTimingsResponse,
  DEFAULT_AL_ADHAN_RESPONSE
} from '@/models/api/al-adhan'

export async function getAlAdhanPrayerTimings(
  date: string,
  position: { lat: number; long: number }
): Promise<AlAdhanPrayerTimingsResponse['data']> {
  // Reference: https://aladhan.com/prayer-times-api#tag/Daily-Prayer-Times/paths/~1v1~1timings~1%7Bdate%7D/get.
  const url = new URL(`https://aladhan.khutwah.id/v1/timings/${date}`)
  url.searchParams.set('latitude', `${position.lat}`)
  url.searchParams.set('longitude', `${position.long}`)
  // 20 is Kemenag's data source.
  url.searchParams.set('method', `20`)

  // Dev's note: there is already a cache layer on the Al-Adhan side: `cache-control: public,max-age=3600`.
  // There is also a rate limit of 24, but seems like the rate limit depends on the cache as well. Assuming the rate limit is reduced
  // by 1 every time the cache expires, we should be fine because it means 1 hour = 1 rate limit used (per browser/client).
  const response = await fetch(url.toString())

  if (!response.ok) {
    console.error(response.statusText)
    return DEFAULT_AL_ADHAN_RESPONSE
  }

  try {
    const json = await response.json()
    const parsed = await AlAdhanPrayerTimingsResponse.validate(json)

    return parsed.data
  } catch (err) {
    console.error(err)
    return DEFAULT_AL_ADHAN_RESPONSE
  }
}
