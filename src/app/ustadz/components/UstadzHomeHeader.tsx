'use client'

import Logo from '@/assets/minhajul-haq-logo-white.png'
import StubAvatarImage from '@/assets/sample-ustadz-photo.png'
import { GreetingsCard } from '@/components/GreetingsCard/GreetingsCard'
import { DateHeader } from '@/components/Header/Date'
import { useAlAdhanInfo } from '@/hooks/useAlAdhanInfo'
import { CircleAlert } from 'lucide-react'
import Image from 'next/image'

interface Props {
  displayName: string
}

export function UstadzHomeHeader({ displayName }: Props) {
  const { alAdhanInfo, missingLocationPermissionMessage } = useAlAdhanInfo()

  return (
    <>
      <div className='flex flex-col gap-y-4 items-center'>
        <Image alt='Minhajul Haq' src={Logo} width={121} height={46} />

        <DateHeader hijriDate={alAdhanInfo?.date.hijri} />
      </div>

      <GreetingsCard
        className='z-10'
        avatarUrl={StubAvatarImage}
        name={displayName}
        salahPrayerTimes={alAdhanInfo?.timings}
      >
        {missingLocationPermissionMessage && (
          <div className='flex gap-x-2 text-mtmh-sm-regular text-mtmh-red-light'>
            <div className='flex flex-col justify-center'>
              <CircleAlert aria-hidden size={16} />
            </div>

            <div>{missingLocationPermissionMessage}</div>
          </div>
        )}
      </GreetingsCard>
    </>
  )
}
