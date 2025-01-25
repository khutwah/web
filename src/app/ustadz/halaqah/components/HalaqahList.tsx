'use client'

import { HalaqahCard } from '@/components/HalaqahCard/HalaqahCard'
import { useContext } from 'react'
import { SearchContext } from '../../components/Search/SearchProvider'

type HalaqahListProps = {
  isAssigned?: boolean
  items: Array<HalaqahItem>
}

export type HalaqahItem = {
  id: number
  name: string
  venue: string
  substituteeName?: string
  hasGutter?: boolean
  isOwner?: boolean
}

export function HalaqahList({ items, isAssigned }: HalaqahListProps) {
  const searchContext = useContext(SearchContext)
  if (searchContext === undefined) {
    throw new Error('HalaqahList must be used within a SearchContext')
  }

  const resolvedItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchContext.searchQuery.toLowerCase())
  )

  if (resolvedItems.length === 0) {
    return (
      <p className='text-khutwah-body-small text-khutwah-neutral-70'>{`Hasil pencarian "${searchContext.searchQuery}" tidak ditemukan`}</p>
    )
  }

  return (
    <ul className='space-y-3'>
      {resolvedItems.map(({ id, name, venue, substituteeName, isOwner }) => (
        <li key={id}>
          <HalaqahCard
            id={id}
            name={name}
            venue={venue}
            substituteeName={substituteeName}
            isOwner={isOwner}
            searchParams={{ from: 'halaqah' }}
            isAssigned={isAssigned}
          />
        </li>
      ))}
    </ul>
  )
}
