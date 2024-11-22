import { clsx } from 'clsx'
import { Card, CardHeader, CardTitle, CardContent } from '../Card/Card'
import Image, { StaticImageData } from 'next/image'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import { cn } from '@/utils/classnames'

dayjs.extend(isSameOrAfter)

interface Props {
  avatarUrl: string | StaticImageData
  name: string
  salahPrayerTimes: {
    imsak: string
    subuh: string
    terbit: string
    dhuha: string
    dzuhur: string
    ashar: string
    maghrib: string
    isya: string
  }
  currentDate?: Date
}

export function GreetingsCard({
  avatarUrl,
  name,
  salahPrayerTimes,
  currentDate
}: Props) {
  return (
    <Card className='w-[327px] bg-mtmh-neutral-white text-mtmh-grey-base shadow'>
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
  salahPrayerTimes: Props['salahPrayerTimes']
  currentDate?: Date
}) {
  const arrayOfPrayerTimings = [
    {
      name: 'Shubuh',
      start: combineSalahTimingWithCurrentDate(
        salahPrayerTimes.subuh,
        currentDate
      ),
      end: combineSalahTimingWithCurrentDate(
        salahPrayerTimes.terbit,
        currentDate
      )
    },
    {
      name: 'Dzuhur',
      start: combineSalahTimingWithCurrentDate(
        salahPrayerTimes.dzuhur,
        currentDate
      ),
      end: combineSalahTimingWithCurrentDate(
        salahPrayerTimes.ashar,
        currentDate
      )
    },
    {
      name: 'Ashr',
      start: combineSalahTimingWithCurrentDate(
        salahPrayerTimes.ashar,
        currentDate
      ),
      end: combineSalahTimingWithCurrentDate(
        salahPrayerTimes.maghrib,
        currentDate
      )
    },
    {
      name: 'Maghrib',
      start: combineSalahTimingWithCurrentDate(
        salahPrayerTimes.maghrib,
        currentDate
      ),
      end: combineSalahTimingWithCurrentDate(salahPrayerTimes.isya, currentDate)
    },
    {
      // Unfortunately this does not cover the isya prayer in the next day, e.g. 00:00-shubuh time.
      // This is because the date already changes to a new date.
      name: 'Isya',
      start: combineSalahTimingWithCurrentDate(
        salahPrayerTimes.isya,
        currentDate
      ),
      end: combineSalahTimingWithCurrentDate(
        salahPrayerTimes.subuh,
        dayjs(currentDate).add(1, 'day').toDate()
      )
    }
  ]

  return (
    <ol className='flex gap-x-1'>
      {arrayOfPrayerTimings.map((timing) => {
        const isActive =
          dayjs(currentDate).isSameOrAfter(timing.start) &&
          dayjs(currentDate).isBefore(timing.end)

        return (
          <li key={timing.name}>
            <div
              className={cn(
                'flex flex-col bg-mtmh-neutral-10 px-1 py-2 rounded items-center w-[55px]',
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
