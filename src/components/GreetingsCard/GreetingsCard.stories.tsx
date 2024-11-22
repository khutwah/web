import { GreetingsCard } from './GreetingsCard'
import photo from '../../assets/sample-ustadz-photo.png'
import dayjs from 'dayjs'

export function GreetingsCardStory() {
  const hours = [5, 9, 12, 16, 18, 20, 3]

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8'>
      {hours.map((hour) => (
        <GreetingsCard
          key={hour}
          avatarUrl={photo}
          name='Ust. Fulan Abdurrahman'
          salahPrayerTimes={{
            imsak: '03:56',
            subuh: '04:06',
            terbit: '05:20',
            dhuha: '05:48',
            dzuhur: '11:37',
            ashar: '14:52',
            maghrib: '17:47',
            isya: '18:59'
          }}
          currentDate={dayjs().hour(hour).minute(0).toDate()}
        />
      ))}
    </div>
  )
}
