import { ActivityCard } from './ActivityCard'

export function ActivityCardStory() {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8'>
      <ActivityCard
        id='1'
        surahStart={{ name: 'At-Taubah', verse: '1' }}
        surahEnd={{ name: 'At-Taubah', verse: '26' }}
        timestamp={new Date().toISOString()}
        pageAmount={4}
        notes='Santri kesulitan menghafal ayat yang memiliki beberapa titik stop dan kemiripan di antara titik-titik tersebut.'
        type='Sabaq'
      />
      <ActivityCard
        id='1'
        surahStart={{ name: 'At-Taubah', verse: '1' }}
        surahEnd={{ name: 'At-Taubah', verse: '1' }}
        timestamp={new Date(2024, 1, 1, 7).toISOString()}
        pageAmount={0}
        notes='Santri tidak hadir karena sakit.'
        type='Sabaq'
      />
      <ActivityCard
        id='1'
        surahStart={{ name: 'Al-Baqarah', verse: '1' }}
        surahEnd={{ name: 'Al-Baqarah', verse: '286' }}
        timestamp={new Date(2024, 1, 1, 7).toISOString()}
        pageAmount={49}
        notes=''
        type='Sabaq'
      />
      <ActivityCard
        id='1'
        surahStart={{ name: 'Al-Mumtahanah', verse: '1' }}
        surahEnd={{ name: 'Al-Mumtahanah', verse: '13' }}
        timestamp={new Date(2024, 1, 1, 7).toISOString()}
        pageAmount={3}
        notes=''
        type='Sabaq'
      />
      <ActivityCard
        id='1'
        surahStart={{ name: "Al-Mu'minun", verse: '1' }}
        surahEnd={{ name: "Al-Mu'minun", verse: '118' }}
        timestamp={new Date(2024, 10, 10, 27).toISOString()}
        pageAmount={8}
        notes=''
        type='Sabaq'
      />
    </div>
  )
}
