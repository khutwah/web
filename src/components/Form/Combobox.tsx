import { Button } from '@/components/Button/Button'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'

import { useMemo, useState } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '../Drawer/Drawer'
import { cn } from '@/utils/classnames'
import { Input } from './Input'

export interface ComboboxProps {
  items: Array<{
    value: string
    label: string
  }>
  onChange: (value: string) => void
  value: string
  placeholder?: string
  searchPlaceholder?: string
  withSearch?: boolean
}

function ComboboxSearch({
  searchPlaceholder,
  onChange
}: Pick<ComboboxProps, 'searchPlaceholder' | 'onChange'>) {
  const debounced = useDebouncedCallback((value) => {
    onChange(value)
  }, 500)

  return (
    <Input
      placeholder={searchPlaceholder}
      onChange={(event) => debounced(event.currentTarget.value)}
    />
  )
}

export function Combobox({
  value,
  onChange,
  items,
  placeholder = '',
  searchPlaceholder = 'Cari',
  withSearch = true
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const _items = useMemo(() => {
    if (!search || !withSearch) return items

    return items.filter((item) =>
      item.label.toLowerCase().includes(search.toLowerCase())
    )
  }, [search, items, withSearch])

  return (
    <Drawer
      open={open}
      onOpenChange={(v) => {
        if (!v) setSearch('')
        setOpen(v)
      }}
    >
      <DrawerTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between'
        >
          {value
            ? items.find((item) => item.value === value)?.label
            : placeholder}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>{placeholder}</DrawerTitle>
        </DrawerHeader>

        {withSearch ? (
          <div className='pt-2 pb-3 px-4'>
            <ComboboxSearch
              onChange={setSearch}
              searchPlaceholder={searchPlaceholder}
            />
          </div>
        ) : null}

        <div className='overflow-y-scroll max-h-[500px] flex flex-col pt-2 px-4 gap-4 pb-12'>
          {_items.map((item) => (
            <Button
              asChild
              variant='outline'
              key={item.value}
              onClick={() => {
                onChange(item.value)
                setOpen(false)
                setSearch('')
              }}
            >
              <label htmlFor={item.label + '-' + item.value}>
                <input
                  id={item.label + '-' + item.value}
                  type='radio'
                  className='hidden'
                />
                {item.label}
                <Check
                  className={cn(
                    'ml-auto',
                    value === item.value ? 'opacity-100' : 'opacity-0'
                  )}
                />
              </label>
            </Button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
