import { ActivityStatus } from '@/models/activities'
import { ActivityCard } from './ActivityCard'
import { ActivityBriefCard } from './ActivityBriefCard'

export function ActivityCardStory() {
  return (
    <>
      <div className='grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-2'>
        <ActivityBriefCard
          id='1'
          isStudentPresent
          studentName='Andrizal Herdiwanto Sukmini'
          halaqahName='Halaqah A1.1'
          surahStart={{ name: 'At-Taubah', verse: '1' }}
          surahEnd={{ name: 'At-Taubah', verse: '26' }}
          timestamp={new Date().toISOString()}
          tz='Asia/Jakarta'
          notes='Santri kesulitan menghafal ayat yang memiliki beberapa titik stop dan kemiripan di antara titik-titik tersebut.'
          type='Sabaq'
          labels={['Terbata-bata', 'Makhrajul salah: ra']}
          status={ActivityStatus.completed}
        />

        <ActivityBriefCard
          id='1'
          isStudentPresent
          studentName='Andrizal Herdiwanto Sukmini'
          halaqahName='Halaqah A1.1'
          surahStart={{ name: 'At-Taubah', verse: '1' }}
          surahEnd={{ name: 'At-Taubah', verse: '26' }}
          timestamp={new Date().toISOString()}
          tz='Asia/Jakarta'
          notes=''
          type='Sabaq'
          labels={['Terbata-bata', 'Makhrajul salah: ra']}
          status={ActivityStatus.completed}
        />

        <ActivityBriefCard
          id='1'
          isStudentPresent
          studentName='Andrizal Herdiwanto Sukmini'
          halaqahName='Halaqah A1.1'
          surahStart={{ name: 'At-Taubah', verse: '1' }}
          surahEnd={{ name: 'At-Taubah', verse: '26' }}
          timestamp={new Date().toISOString()}
          tz='Asia/Jakarta'
          notes=''
          type='Sabaq'
          labels={['Terbata-bata', 'Makhrajul salah: ra']}
          status={ActivityStatus.draft}
        />

        <ActivityBriefCard
          id='1'
          isStudentPresent
          surahStart={{ name: 'At-Taubah', verse: '1' }}
          surahEnd={{ name: 'At-Taubah', verse: '26' }}
          timestamp={new Date().toISOString()}
          tz='Asia/Jakarta'
          notes=''
          type='Sabaq'
          labels={['Terbata-bata', 'Makhrajul salah: ra']}
          status={ActivityStatus.draft}
        />

        <ActivityBriefCard
          id='1'
          isStudentPresent
          surahStart={{ name: 'At-Taubah', verse: '1' }}
          surahEnd={{ name: 'At-Taubah', verse: '26' }}
          timestamp={new Date().toISOString()}
          tz='Asia/Jakarta'
          notes='Santri kesulitan menghafal ayat yang memiliki beberapa titik stop dan kemiripan di antara titik-titik tersebut.'
          type='Sabaq'
          labels={['Terbata-bata', 'Makhrajul salah: ra']}
          status={ActivityStatus.draft}
        />
      </div>

      <div className='pb-8'></div>

      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2'>
        <ActivityCard
          id='1'
          isStudentPresent
          studentName='Andrizal Herdiwanto Sukmini'
          halaqahName='Halaqah A1.1'
          surahStart={{ name: 'At-Taubah', verse: '1' }}
          surahEnd={{ name: 'At-Taubah', verse: '26' }}
          timestamp={new Date().toISOString()}
          tz='Asia/Jakarta'
          notes='Santri kesulitan menghafal ayat yang memiliki beberapa titik stop dan kemiripan di antara titik-titik tersebut.'
          type='Sabaq'
          labels={['Terbata-bata', 'Makhrajul salah: ra']}
          status={ActivityStatus.completed}
        />
        <ActivityCard
          id='2'
          isStudentPresent
          studentName='Andrizal Herdiwanto Sukmini'
          halaqahName='Halaqah A1.1'
          surahStart={{ name: 'At-Taubah', verse: '1' }}
          surahEnd={{ name: 'At-Taubah', verse: '1' }}
          timestamp={new Date(2024, 1, 1, 7).toISOString()}
          tz='Asia/Jakarta'
          notes='Santri kesulitan menghafal ayat yang memiliki beberapa titik stop dan kemiripan di antara titik-titik tersebut.'
          type='Sabqi'
          labels={['Terbata-bata']}
          status={ActivityStatus.completed}
        />
        <ActivityCard
          id='3'
          isStudentPresent
          studentName='Andrizal Herdiwanto Sukmini'
          halaqahName='Halaqah A1.1'
          surahStart={{ name: 'Al-Baqarah', verse: '1' }}
          surahEnd={{ name: 'Al-Baqarah', verse: '286' }}
          timestamp={new Date(2024, 1, 1, 7).toISOString()}
          tz='Asia/Jakarta'
          notes=''
          type='Manzil'
          labels={['Makhrajul salah: ra']}
          status={ActivityStatus.completed}
        />
        <ActivityCard
          id='4'
          isStudentPresent
          surahStart={{ name: 'Al-Mumtahanah', verse: '1' }}
          surahEnd={{ name: 'Al-Mumtahanah', verse: '13' }}
          timestamp={new Date(2024, 1, 1, 7).toISOString()}
          tz='Asia/Jakarta'
          notes='Santri kesulitan menghafal ayat yang memiliki beberapa titik stop dan kemiripan di antara titik-titik tersebut.'
          type='Sabaq'
          status={ActivityStatus.completed}
        />
        <ActivityCard
          id='5'
          isStudentPresent
          surahStart={{ name: "Al-Mu'minun", verse: '1' }}
          surahEnd={{ name: "Al-Mu'minun", verse: '118' }}
          timestamp={new Date(2024, 10, 10, 27).toISOString()}
          tz='Asia/Jakarta'
          notes='Santri kesulitan menghafal ayat yang memiliki beberapa titik stop dan kemiripan di antara titik-titik tersebut.'
          type='Sabqi'
          status={ActivityStatus.completed}
        />
        <ActivityCard
          id='6'
          isStudentPresent
          surahStart={{ name: "Al-Mu'minun", verse: '1' }}
          surahEnd={{ name: "Al-Mu'minun", verse: '118' }}
          timestamp={new Date(2024, 10, 10, 27).toISOString()}
          tz='Asia/Jakarta'
          notes=''
          type='Manzil'
          status={ActivityStatus.draft}
        />
        <ActivityCard
          id='7'
          isStudentPresent={false}
          surahStart={{ name: 'Al-Mumtahanah', verse: '1' }}
          surahEnd={{ name: 'Al-Mumtahanah', verse: '13' }}
          timestamp={new Date(2024, 1, 1, 7).toISOString()}
          tz='America/New_York'
          notes=''
          type='Sabaq'
          status={ActivityStatus.completed}
        />
        <ActivityCard
          id='8'
          isStudentPresent={false}
          surahStart={{ name: "Al-Mu'minun", verse: '1' }}
          surahEnd={{ name: "Al-Mu'minun", verse: '118' }}
          timestamp={new Date(2024, 10, 10, 27).toISOString()}
          tz='America/New_York'
          notes=''
          type='Sabqi'
          status={ActivityStatus.completed}
        />
        <ActivityCard
          id='9'
          isStudentPresent={false}
          surahStart={{ name: "Al-Mu'minun", verse: '1' }}
          surahEnd={{ name: "Al-Mu'minun", verse: '118' }}
          timestamp={new Date(2024, 10, 10, 27).toISOString()}
          tz='America/New_York'
          notes=''
          type='Manzil'
          status={ActivityStatus.draft}
        />
      </div>
    </>
  )
}
