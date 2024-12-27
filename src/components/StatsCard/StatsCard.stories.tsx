import { StatsCard } from './StatsCard'

export function StatsCardStory() {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8'>
      <StatsCard surah={2} ayah={1} halaqahCount={3} />
    </div>
  )
}
