'use client'

import Logo from '@/components/Logo'
import UstadzImage from '@/assets/sample-ustadz-photo.png'
import SantriImage from '@/assets/sample-santri-photo.png'
import { GreetingsCard } from '@/components/GreetingsCard/GreetingsCard'
import { DateHeader } from '@/components/Header/Date'
import { useAlAdhanInfo } from '@/hooks/useAlAdhanInfo'
import { CircleAlert } from 'lucide-react'

interface Props {
  displayName: string
  ustadz?: boolean
  isLoading?: boolean
}

export function HomeHeader({ displayName, ustadz, isLoading }: Props) {
  const { alAdhanInfo, errorMessage } = useAlAdhanInfo()

  return (
    <>
      <div className='flex flex-col gap-y-4 items-center'>
        <Logo variant='white' />

        <DateHeader hijriDate={alAdhanInfo?.date.hijri} />
      </div>

      <GreetingsCard
        className='z-10'
        avatarUrl={ustadz ? UstadzImage : SantriImage}
        name={displayName}
        salahPrayerTimes={alAdhanInfo?.timings}
        isLoading={isLoading}
      >
        {errorMessage && (
          <div className='flex gap-x-2 text-khutwah-sm-regular text-khutwah-red-light'>
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
