'use client'

import Logo from '@/assets/minhajul-haq-logo-white.png'
import UstadzImage from '@/assets/sample-ustadz-photo.png'
import SantriImage from '@/assets/sample-santri-photo.png'
import { GreetingsCard } from '@/components/GreetingsCard/GreetingsCard'
import { DateHeader } from '@/components/Header/Date'
import { useAlAdhanInfo } from '@/hooks/useAlAdhanInfo'
import { CircleAlert } from 'lucide-react'
import Image from 'next/image'

interface Props {
  displayName: string
  ustadz?: boolean
}

export function HomeHeader({ displayName, ustadz }: Props) {
  const { alAdhanInfo, errorMessage } = useAlAdhanInfo()

  return (
    <>
      <div className='flex flex-col gap-y-4 items-center'>
        <Image alt='Minhajul Haq' src={Logo} width={121} />

        <DateHeader hijriDate={alAdhanInfo?.date.hijri} />
      </div>

      <GreetingsCard
        className='z-10'
        avatarUrl={ustadz ? UstadzImage : SantriImage}
        name={displayName}
        salahPrayerTimes={alAdhanInfo?.timings}
      >
        {errorMessage && (
          <div className='flex gap-x-2 text-mtmh-sm-regular text-mtmh-red-light'>
            <div className='flex flex-col justify-center'>
              <CircleAlert aria-hidden size={16} />
            </div>

            <div>{errorMessage}</div>
          </div>
        )}
      </GreetingsCard>
    </>
  )
}
