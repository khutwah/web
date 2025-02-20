'use client'

import { clsx } from 'clsx'
import { Card, CardHeader, CardTitle, CardContent } from '../Card/Card'
import Image, { ImageProps } from 'next/image'
import dayjs from '@/utils/dayjs'
import { cn } from '@/utils/classnames'
import { AlAdhanPrayerTimingsResponse } from '@/models/api/al-adhan'
import { PropsWithChildren } from 'react'
import { Skeleton } from '@/components/Skeleton/Skeleton'

interface Props {
  avatarUrl: ImageProps['src']
  name: string
  salahPrayerTimes:
    | AlAdhanPrayerTimingsResponse['data']['timings']
    | null
    | undefined
  currentDate?: Date
  className?: string
  isLoading?: boolean
}

export function GreetingsCard({
  avatarUrl,
  name,
  salahPrayerTimes,
  className,
  currentDate,
  isLoading,
  children
}: PropsWithChildren<Props>) {
  return (
    <Card
      className={cn(
        'w-full bg-khutwah-neutral-white text-khutwah-grey-base shadow-md',
        className
      )}
    >
      <CardHeader className='rounded-t-xl p-5 pb-3'>
        <CardTitle className='flex justify-between'>
          <div className='flex-col'>
            <div className='text-khutwah-m-regular text-khutwah-grey-lightest'>
              Assalamu&apos;alaikum,
            </div>
            <div className='text-khutwah-l-semibold'>
              {isLoading ? <Skeleton className='w-full h-4' /> : name}
            </div>
          </div>

          <Image
            src={avatarUrl}
            alt={`Profile picture of ${name}`}
            width={52}
            height={52}
            className='rounded-full'
          />
        </CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col p-5 pt-0 gap-y-2'>
        <SalahTimebox
          currentDate={currentDate}
          salahPrayerTimes={isLoading ? undefined : salahPrayerTimes}
        />

        {children}
      </CardContent>
    </Card>
  )
}

function SalahTimebox({
  salahPrayerTimes,
  currentDate
}: {
  salahPrayerTimes?: Props['salahPrayerTimes']
  currentDate?: Date
}) {
  if (!salahPrayerTimes) {
    // Render skeleton when salahPrayerTimes is null or undefined.
    return (
      <ol className='flex justify-between gap-x-1'>
        {['Shubuh', 'Dzuhur', 'Ashr', 'Maghrib', 'Isya'].map((name) => (
          <li key={name} className='flex flex-1'>
            <div className='flex flex-col bg-khutwah-neutral-10 px-1 py-2 rounded items-center w-full'>
              <div className='text-khutwah-grey-lightest text-khutwah-sm-regular'>
                {name}
              </div>
              <div className='bg-khutwah-grey-lightest h-4 w-12 rounded animate-pulse mt-1'></div>
            </div>
          </li>
        ))}
      </ol>
    )
  }

  const arrayOfPrayerTimings = [
    {
      name: 'Shubuh',
      start: salahPrayerTimes.Fajr,
      end: salahPrayerTimes.Sunrise
    },
    {
      name: 'Dzuhur',
      start: salahPrayerTimes.Dhuhr,
      end: salahPrayerTimes.Asr
    },
    {
      name: 'Ashr',
      start: salahPrayerTimes.Asr,
      end: salahPrayerTimes.Maghrib
    },
    {
      name: 'Maghrib',
      start: salahPrayerTimes.Maghrib,
      end: salahPrayerTimes.Isha
    },
    {
      // Unfortunately this does not cover the isya prayer time in the next day, e.g. 00:00-shubuh time.
      // This is because the date already changes to a new date, and we don't show isya prayer on the following day.
      name: 'Isya',
      start: salahPrayerTimes.Isha,
      end: '23:59'
    }
  ].map((item) => ({
    ...item,
    start: combineSalahTimingWithCurrentDate(item.start, currentDate),
    end: combineSalahTimingWithCurrentDate(item.end, currentDate)
  }))

  return (
    <ol className='flex justify-between gap-x-1'>
      {arrayOfPrayerTimings.map((timing) => {
        const isActive =
          dayjs(currentDate).isSameOrAfter(timing.start) &&
          dayjs(currentDate).isBefore(timing.end)

        return (
          <li key={timing.name} className='flex flex-1'>
            <div
              className={cn(
                'flex flex-col bg-khutwah-neutral-10 px-1 py-2 rounded items-center w-full',
                {
                  'bg-khutwah-tamarind-lighter': isActive
                }
              )}
            >
              <div
                className={clsx('text-khutwah-sm-regular', {
                  'text-khutwah-tamarind-dark': isActive,
                  'text-khutwah-grey-lightest': !isActive
                })}
              >
                {timing.name}
              </div>
              <div className='text-khutwah-grey-base text-khutwah-m-semibold'>
                {timing.start.format('HH:mm')}
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function combineSalahTimingWithCurrentDate(timing: string, currentDate?: Date) {
  const [hour, minute] = timing.split(':')
  return dayjs(currentDate).hour(Number(hour)).minute(Number(minute))
}
