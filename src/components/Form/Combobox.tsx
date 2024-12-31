import { Button } from '@/components/Button/Button'
import { Check, ChevronsUpDown, CircleX, X } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'

import {
  ComponentProps,
  DetailedHTMLProps,
  InputHTMLAttributes,
  useMemo,
  useState,
  useRef,
  useEffect,
  forwardRef,
  useTransition
} from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
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
    searchable?: string
  }>
  onChange: (value: string) => void
  value: string
  placeholder?: string
  searchPlaceholder?: string
  withSearch?: boolean
  mustSelect?: boolean
  startFrom?: number // this is only for "value" that have type number so we can disable the value below defined
}

interface ComboboxButtonProps {
  onClick?: ComponentProps<typeof Button>['onClick']
  disabled?: boolean
  label: string
  checked: boolean
  inputProps?: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
}

export const ComboboxButton = forwardRef<
  HTMLButtonElement,
  ComboboxButtonProps
>(({ onClick, disabled, label, checked, inputProps }, ref) => {
  const handleKeyDown: ComponentProps<typeof Button>['onKeyDown'] = (event) => {
    if (disabled) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick?.(
        event as unknown as Parameters<
          NonNullable<ComponentProps<typeof Button>['onClick']>
        >[0]
      )
    }
  }

  return (
    <Button
      ref={ref}
      asChild
      className='cursor-pointer'
      variant='outline'
      onClick={(e) => {
        if (disabled) return
        return onClick?.(e)
      }}
      disabled={disabled}
      tabIndex={0}
      aria-checked={checked}
      role='radio'
      onKeyDown={handleKeyDown}
    >
      <label>
        <input
          type='radio'
          className='hidden'
          defaultChecked={checked}
          {...inputProps}
          aria-hidden='true'
          tabIndex={-1}
        />
        {label}
        <Check
          aria-hidden
          className={cn('ml-auto', checked ? 'opacity-100' : 'opacity-0')}
        />
      </label>
    </Button>
  )
})
ComboboxButton.displayName = 'ComboboxButton'

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
  withSearch = true,
  mustSelect,
  startFrom
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const selectedRef = useRef<HTMLButtonElement>(null)
  const [isTransitioning] = useTransition()

  useEffect(() => {
    if (open && value) {
      requestAnimationFrame(() => {
        selectedRef.current?.scrollIntoView({
          behavior: 'instant',
          block: 'center'
        })
      })
    }
  }, [open, value])

  const _items = useMemo(() => {
    if (!search || !withSearch) return items

    return items.filter((item) =>
      (item.searchable || item.value)
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  }, [search, items, withSearch])
  const selectedValue = _items.find((item) => item.value === value)

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
          aria-expanded={open}
          className='w-full flex items-center justify-between'
        >
          <span className='flex-grow text-left'>
            {value
              ? items.find((item) => item.value === value)?.label
              : placeholder}
          </span>

          <div className='flex items-center space-x-2'>
            {value && !mustSelect && (
              <span
                onClick={(e) => {
                  e.stopPropagation()
                  onChange('')
                }}
                role='button'
                aria-label='Clear selection'
                className='p-1 cursor-pointer text-gray-500 hover:text-gray-700'
              >
                <X size={8} className='opacity-50' />
              </span>
            )}
            <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
          </div>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerDescription />
          <DrawerTitle>
            <div className='flex items-center justify-between'>
              <div className='text-left'>{placeholder}</div>
              {selectedValue && !mustSelect && (
                <Button
                  className='max-w-xs'
                  variant='outline'
                  disabled={isTransitioning}
                  onClick={() => onChange('')}
                >
                  <CircleX size={8} />{' '}
                  {
                    <label className='text-mtmh-sm-regular block w-full truncate'>
                      {_items.find((item) => item.value === value)?.label}
                    </label>
                  }
                </Button>
              )}
            </div>
          </DrawerTitle>
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
          {_items.map((item) => {
            const disabled =
              startFrom && Number(item.value)
                ? Number(item.value) < startFrom
                : false
            const isSelected = value === item.value
            return (
              <ComboboxButton
                key={item.value}
                disabled={disabled}
                onClick={() => {
                  if (disabled) return
                  onChange(item.value)
                  setOpen(false)
                  setSearch('')
                }}
                label={item.label}
                checked={isSelected}
                ref={isSelected ? selectedRef : undefined}
              />
            )
          })}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
