'use client'

import { Input } from '@/components/Form/Input'
import { Search } from 'lucide-react'
import { ComponentProps, useContext } from 'react'
import { SearchContext } from './SearchProvider'
import { cn } from '@/utils/classnames'

const CLASSES_BY_COLOR = {
  red: {
    // Dev's note: this is required so that the input is seen as "integrated" with the header.
    // Alternatively, what we can do is adding <HeaderBackground /> (which is absolutely positioned), so we don't have to add an outer container.
    outerContainer: 'pb-4 px-4 bg-mtmh-red-base',
    innerContainer:
      'bg-mtmh-red-darker text-mtmh-red-lightest focus-within:text-white',
    input:
      'placeholder-mtmh-red-lightest border-mtmh-red-darker focus:placeholder-white ring-mtmh-red-lightest'
  },
  white: {
    outerContainer: '',
    innerContainer:
      'text-mtmh-grey-lighter focus-within:text-mtmh-grey-lighter',
    input:
      'placeholder-mtmh-grey-lighter border-mtmh-grey-darker ring-mtmh-grey-lighter'
  }
} as const

interface Props
  extends Pick<ComponentProps<typeof Input>, 'id' | 'name' | 'placeholder'> {
  color?: 'white' | 'red'
}

export function SearchSection({ color = 'red', ...inputProps }: Props) {
  const searchContext = useContext(SearchContext)
  if (searchContext === undefined) {
    throw new Error('SearchSection must be used within a SearchContext')
  }

  const classes = CLASSES_BY_COLOR[color]

  return (
    <div className={classes.outerContainer}>
      <div
        className={cn(
          'flex rounded-md relative w-full',
          classes.innerContainer
        )}
      >
        <Search size={16} aria-hidden className='absolute h-full ml-3' />
        <Input
          type='text'
          className={cn('pl-10', classes.input)}
          value={searchContext.searchQuery}
          onChange={(e) => {
            searchContext.setSearchQuery(e.target.value)
          }}
          {...inputProps}
        />
      </div>
    </div>
  )
}
