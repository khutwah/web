'use client'

import Logo from '@/assets/minhajul-haq-logo-white.png'
import StubAvatarImage from '@/assets/sample-ustadz-photo.png'
import { GreetingsCard } from '@/components/GreetingsCard/GreetingsCard'
import {
  AlAdhanPrayerTimingsResponse,
  HIJRI_MONTH_NUMBER_TO_TEXT_RECORD
} from '@/models/api/al-adhan'
import { getAlAdhanPrayerTimings } from '@/utils/api/al-adhan'
import { getUser } from '@/utils/supabase/get-user'
import dayjs from 'dayjs'
import { CircleAlert } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const PURWAKARTA_LAT_LONG = {
  lat: -6.6167,
  long: 107.5333
}

interface Props {
  user: Awaited<ReturnType<typeof getUser>>
}

export function UstadzHomeHeader({ user }: Props) {
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

  return (
    <>
      <div className='flex flex-col gap-y-4 items-center'>
        <Image alt='Minhajul Haq' src={Logo} width={121} height={46} />

        <div className='flex gap-x-[6.5px] text-mtmh-m-regular text-mtmh-neutral-white'>
          {alAdhanInfo?.date.hijri && (
            <HijriDate date={alAdhanInfo?.date.hijri} />
          )}

          <div>{dayjs().format('D MMMM YYYY')}</div>
        </div>
      </div>

      <GreetingsCard
        className='z-10'
        avatarUrl={StubAvatarImage}
        name={user.data?.name ?? ''}
        salahPrayerTimes={alAdhanInfo?.timings}
      >
        {!hasLocationPermission && (
          <div className='flex gap-x-2 text-mtmh-sm-regular text-mtmh-red-light'>
            <div className='flex flex-col justify-center'>
              <CircleAlert aria-hidden size={16} />
            </div>

            <div>
              Izin penggunaan lokasi tidak diberikan. Waktu sholat di atas
              berlaku untuk daerah Wanayasa, Kabupaten Purwakarta dan
              sekitarnya.
            </div>
          </div>
        )}
      </GreetingsCard>
    </>
  )
}

function HijriDate({
  date
}: {
  date: NonNullable<AlAdhanPrayerTimingsResponse['data']['date']['hijri']>
}) {
  const monthText = HIJRI_MONTH_NUMBER_TO_TEXT_RECORD[date.month.number]

  return (
    <>
      <div>
        {Number(date.day)} {monthText} {date.year} H
      </div>
      <div>•</div>
    </>
  )
}
