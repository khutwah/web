import { HalaqahCard } from './HalaqahCard'

export function HalaqahCardStory() {
  const halaqahList = [
    { name: 'Halaqah 1.1', venue: 'Saung Ali bin Abi Thalib' },
    { name: 'Halaqah 1.2', venue: 'Saung Abu Bakar Ash-Shidiq' },
    { name: 'Halaqah 1.3', venue: 'Saung Umar bin Khattab' }
  ]

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8'>
      {halaqahList.map((halaqah) => (
        <HalaqahCard key={halaqah.name} {...halaqah} />
      ))}

      {halaqahList.map((halaqah) => (
        <HalaqahCard key={halaqah.name} hasGutter {...halaqah} />
      ))}

      {halaqahList.map((halaqah) => (
        <HalaqahCard
          key={halaqah.name}
          hasGutter
          substituteeName='Ust. Ade'
          {...halaqah}
        />
      ))}
    </div>
  )
}
