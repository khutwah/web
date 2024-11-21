import { ActivityCard } from './ActivityCard'

export function ActivityCardStory() {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8'>
      <ActivityCard
        id='1'
        isStudentPresent
        studentName='Andrizal Herdiwanto Sukmini'
        halaqahName='Halaqah A1.1'
        surahStart={{ name: 'At-Taubah', verse: '1' }}
        surahEnd={{ name: 'At-Taubah', verse: '26' }}
        timestamp={new Date().toISOString()}
        notes='Santri kesulitan menghafal ayat yang memiliki beberapa titik stop dan kemiripan di antara titik-titik tersebut.'
        type='Sabaq'
        labels={['Terbata-bata', 'Makhrajul salah: ra']}
      />
      <ActivityCard
        id='2'
        isStudentPresent
        studentName='Andrizal Herdiwanto Sukmini'
        halaqahName='Halaqah A1.1'
        surahStart={{ name: 'At-Taubah', verse: '1' }}
        surahEnd={{ name: 'At-Taubah', verse: '1' }}
        timestamp={new Date(2024, 1, 1, 7).toISOString()}
        notes='Santri kesulitan menghafal ayat yang memiliki beberapa titik stop dan kemiripan di antara titik-titik tersebut.'
        type='Sabqi'
        labels={['Terbata-bata']}
      />
      <ActivityCard
        id='3'
        isStudentPresent
        studentName='Andrizal Herdiwanto Sukmini'
        halaqahName='Halaqah A1.1'
        surahStart={{ name: 'Al-Baqarah', verse: '1' }}
        surahEnd={{ name: 'Al-Baqarah', verse: '286' }}
        timestamp={new Date(2024, 1, 1, 7).toISOString()}
        notes=''
        type='Manzil'
        labels={['Makhrajul salah: ra']}
      />
      <ActivityCard
        id='4'
        isStudentPresent
        surahStart={{ name: 'Al-Mumtahanah', verse: '1' }}
        surahEnd={{ name: 'Al-Mumtahanah', verse: '13' }}
        timestamp={new Date(2024, 1, 1, 7).toISOString()}
        notes='Santri kesulitan menghafal ayat yang memiliki beberapa titik stop dan kemiripan di antara titik-titik tersebut.'
        type='Sabaq'
      />
      <ActivityCard
        id='5'
        isStudentPresent
        surahStart={{ name: "Al-Mu'minun", verse: '1' }}
        surahEnd={{ name: "Al-Mu'minun", verse: '118' }}
        timestamp={new Date(2024, 10, 10, 27).toISOString()}
        notes='Santri kesulitan menghafal ayat yang memiliki beberapa titik stop dan kemiripan di antara titik-titik tersebut.'
        type='Sabqi'
      />
      <ActivityCard
        id='6'
        isStudentPresent
        surahStart={{ name: "Al-Mu'minun", verse: '1' }}
        surahEnd={{ name: "Al-Mu'minun", verse: '118' }}
        timestamp={new Date(2024, 10, 10, 27).toISOString()}
        notes=''
        type='Manzil'
      />
      <ActivityCard
        id='7'
        isStudentPresent={false}
        surahStart={{ name: 'Al-Mumtahanah', verse: '1' }}
        surahEnd={{ name: 'Al-Mumtahanah', verse: '13' }}
        timestamp={new Date(2024, 1, 1, 7).toISOString()}
        notes=''
        type='Sabaq'
      />
      <ActivityCard
        id='8'
        isStudentPresent={false}
        surahStart={{ name: "Al-Mu'minun", verse: '1' }}
        surahEnd={{ name: "Al-Mu'minun", verse: '118' }}
        timestamp={new Date(2024, 10, 10, 27).toISOString()}
        notes=''
        type='Sabqi'
      />
      <ActivityCard
        id='9'
        isStudentPresent={false}
        surahStart={{ name: "Al-Mu'minun", verse: '1' }}
        surahEnd={{ name: "Al-Mu'minun", verse: '118' }}
        timestamp={new Date(2024, 10, 10, 27).toISOString()}
        notes=''
        type='Manzil'
      />
    </div>
  )
}
