'use client'

import { clsx } from 'clsx'
import { Card, CardHeader, CardTitle, CardContent } from '../Card/Card'
import Image, { ImageProps } from 'next/image'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import { cn } from '@/utils/classnames'
import { AlAdhanPrayerTimingsResponse } from '@/models/api/al-adhan'
import 'dayjs/locale/id'

dayjs.extend(isSameOrAfter)
dayjs.locale('id')

interface Props {
  avatarUrl: ImageProps['src']
  name: string
  salahPrayerTimes: AlAdhanPrayerTimingsResponse['data']['timings']
  currentDate?: Date
  className?: string
}

export function GreetingsCard({
  avatarUrl,
  name,
  salahPrayerTimes,
  className,
  currentDate
}: Props) {
  return (
    <Card
      className={cn(
        'w-full bg-mtmh-neutral-white text-mtmh-grey-base shadow-md',
        className
      )}
    >
      <CardHeader className='rounded-t-xl p-5 pb-3'>
        <CardTitle className='flex justify-between'>
          <div className='flex-col'>
            <div className='text-mtmh-m-regular text-mtmh-grey-lightest'>
              Selamat datang
            </div>
            <div className='text-mtmh-l-semibold'>{name}</div>
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
      <CardContent className='flex flex-col p-5 pt-0'>
        <SalahTimebox
          currentDate={currentDate}
          salahPrayerTimes={salahPrayerTimes}
        />
      </CardContent>
    </Card>
  )
}

function SalahTimebox({
  salahPrayerTimes,
  currentDate
}: {
  salahPrayerTimes: AlAdhanPrayerTimingsResponse['data']['timings']
  currentDate?: Date
}) {
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
                'flex flex-col bg-mtmh-neutral-10 px-1 py-2 rounded items-center w-full',
                {
                  'bg-mtmh-tamarind-lighter': isActive
                }
              )}
            >
              <div
                className={clsx('text-mtmh-sm-regular', {
                  'text-mtmh-tamarind-dark': isActive,
                  'text-mtmh-grey-lightest': !isActive
                })}
              >
                {timing.name}
              </div>
              <div className='text-mtmh-grey-base text-mtmh-m-semibold'>
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
