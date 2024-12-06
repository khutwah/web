import {
  AlAdhanPrayerTimingsResponse,
  DEFAULT_AL_ADHAN_RESPONSE
} from '@/models/api/al-adhan'
import { getAlAdhanPrayerTimings } from '@/utils/api/al-adhan'
import dayjs from 'dayjs'
import { useState, useEffect } from 'react'

const PURWAKARTA_LAT_LONG = {
  lat: -6.6167,
  long: 107.5333
}

export function useAlAdhanInfo() {
  const [hasLocationPermission, setHasLocationPermission] = useState(false)
  const [alAdhanInfo, setAlAdhanInfo] = useState<
    AlAdhanPrayerTimingsResponse['data'] | null
  >(null)

  useEffect(() => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const greetingsCardInfo = await getAlAdhanPrayerTimings(
            dayjs().format('DD-MM-YYYY'),
            {
              lat: position.coords.latitude,
              long: position.coords.longitude
            }
          )

          setHasLocationPermission(true)
          setAlAdhanInfo(greetingsCardInfo)
        } catch (err) {
          // Not likely to have an error here since we already handle it inside `getAlAdhanPrayerTimings`. But just so it doesn't crash.
          console.error(err)
        }
      },
      async (error) => {
        console.error(error)

        // Use default lat/long when there are no permissions.
        const greetingsCardInfo = await getAlAdhanPrayerTimings(
          dayjs().format('DD-MM-YYYY'),
          PURWAKARTA_LAT_LONG
        )

        setAlAdhanInfo(greetingsCardInfo)
      }
    )
  }, [])

  return {
    alAdhanInfo,
    errorMessage:
      alAdhanInfo === DEFAULT_AL_ADHAN_RESPONSE
        ? 'Gagal mengambil data waktu sholat. Silakan refresh untuk mencoba lagi.'
        : alAdhanInfo && !hasLocationPermission // Here we need to wait alAdhanInfo is not null before checking the location permission.
          ? 'Izin penggunaan lokasi tidak diberikan. Waktu sholat di atas berlaku untuk daerah Wanayasa, Kabupaten Purwakarta dan sekitarnya.'
          : undefined // This is also returned when alAdhanInfo is null.
  }
}
