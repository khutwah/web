import { StatsCard } from './StatsCard'

export function StatsCardStory() {
  return (
    <div className='flex flex-col gap-8'>
      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8'>
        <StatsCard surah={3} ayah={5} halaqahCount={200} />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8'>
        <StatsCard surah={17} ayah={111} halaqahCount={200} />
      </div>
    </div>
  )
}
