'use client'

import { Input } from '@/components/Form/Input'
import { Search } from 'lucide-react'
import { useContext } from 'react'
import { SearchContext } from './SearchProvider'

export function SearchSection() {
  const searchContext = useContext(SearchContext)
  if (searchContext === undefined) {
    throw new Error('SearchSection must be used within a SearchContext')
  }

  return (
    <div className='pb-4 px-4 bg-mtmh-red-base'>
      <div className='flex rounded-md relative w-full bg-mtmh-red-darker text-mtmh-red-lightest focus-within:text-white'>
        <Search size={16} aria-hidden className='absolute h-full ml-3' />
        <Input
          id='search-santri'
          name='search-santri'
          type='text'
          placeholder='Cari halaqah...'
          className='pl-10 border-mtmh-red-darker placeholder-mtmh-red-lightest focus:placeholder-white ring-mtmh-red-lightest'
          value={searchContext.searchQuery}
          onChange={(e) => {
            searchContext.setSearchQuery(e.target.value)
          }}
        />
      </div>
    </div>
  )
}
