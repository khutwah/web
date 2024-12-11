'use client'

import { createContext, useState } from 'react'

export const SearchContext = createContext<
  | {
      searchQuery: string
      setSearchQuery: React.Dispatch<React.SetStateAction<string>>
    }
  | undefined
>(undefined)

export default function SearchProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}
