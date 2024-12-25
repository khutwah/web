'use client'

import { Dot, Filter } from 'lucide-react'
import Form from 'next/form'

import { Button } from '@/components/Button/Button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/Drawer/Drawer'
import { UstadzFilter } from './UstadzFilter'
import { CheckpointStatusFilter } from './CheckpointStatusFilter'
import { useMemo, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { addQueryParams, parseSearchParams } from '@/utils/url'
import {
  CHECKPOINT_STATUS_SEARCH_PARAMS_KEY,
  USTADZ_ID_SEARCH_PARAMS_KEY
} from '../constants'
import { resolve } from 'path'

export function FilterDrawer({ children }: { children?: React.ReactNode }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const [open, setOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    const formData = new FormData(e.currentTarget)

    const ustadzId = formData.get('ustadzId')
    const checkpointStatuses = formData
      .getAll('checkpointStatuses')
      ?.map((status) => String(status))

    if (typeof ustadzId === 'string') {
      params.set(USTADZ_ID_SEARCH_PARAMS_KEY, ustadzId)
    }

    if (Array.isArray(checkpointStatuses)) {
      params.delete(CHECKPOINT_STATUS_SEARCH_PARAMS_KEY)
      checkpointStatuses.forEach((status) => {
        params.append(CHECKPOINT_STATUS_SEARCH_PARAMS_KEY, status)
      })
    }

    router.replace(`${pathname}?${params.toString()}`)
  }

  const parsedSearchParams = parseSearchParams(searchParams, {
    [USTADZ_ID_SEARCH_PARAMS_KEY]: 'number',
    [CHECKPOINT_STATUS_SEARCH_PARAMS_KEY]: 'array'
  })
  const ustadzIdParam = parsedSearchParams[USTADZ_ID_SEARCH_PARAMS_KEY]
  const checkpointStatusesParam =
    parsedSearchParams[CHECKPOINT_STATUS_SEARCH_PARAMS_KEY]

  const filters = useMemo(() => {
    const resolvedFilters = []
    if (ustadzIdParam) {
      resolvedFilters.push(ustadzIdParam)
    }

    if (Array.isArray(checkpointStatusesParam)) {
      checkpointStatusesParam.forEach((status) => resolvedFilters.push(status))
    }

    return resolvedFilters
  }, [ustadzIdParam, checkpointStatusesParam])

  const hasFilter = filters.length > 0

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          aria-label='Filter daftar santri'
          variant='outline'
          size='sm'
          className='relative'
        >
          <span>Filter{hasFilter ? ` (${filters.length})` : ''}</span>
          <Filter />
        </Button>
      </DrawerTrigger>
      <DrawerContent className='pb-6'>
        <DrawerHeader>
          <DrawerTitle>Filter</DrawerTitle>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className='px-4 space-y-8'>
          <div className='space-y-3'>
            <UstadzFilter selected={ustadzIdParam} />
            <CheckpointStatusFilter selected={checkpointStatusesParam} />
          </div>
          <div className='flex space-x-3'>
            <Button className='w-full block' type='reset' variant='outline'>
              Reset
            </Button>
            <Button className='w-full block' type='submit'>
              Terapkan
            </Button>
          </div>
        </form>

        {children}
      </DrawerContent>
    </Drawer>
  )
}
