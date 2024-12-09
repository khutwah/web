import { GreetingsCard } from './GreetingsCard'
import photo from '../../assets/sample-ustadz-photo.png'
import dayjs from '@/utils/dayjs'

export function GreetingsCardStory() {
  const hours = [5, 9, 12, 16, 18, 20, 3, undefined]

  return (
    <ol className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8'>
      {hours.map((hour) => {
        const currentDate = dayjs().hour(Number(hour)).minute(0).toDate()

        return (
          <li className='flex flex-col gap-y-2' key={hour}>
            <div>{currentDate.toLocaleString()}</div>

            <GreetingsCard
              key={hour}
              avatarUrl={photo}
              name='Ust. Fulan Abdurrahman'
              salahPrayerTimes={
                hour
                  ? {
                      Imsak: '03:56',
                      Fajr: '04:06',
                      Sunrise: '05:20',
                      Dhuhr: '11:37',
                      Asr: '14:52',
                      Maghrib: '17:47',
                      Isha: '18:59',
                      // Unused.
                      Midnight: '00:00',
                      Sunset: '00:00'
                    }
                  : undefined
              }
              currentDate={currentDate}
            />
          </li>
        )
      })}
    </ol>
  )
}
