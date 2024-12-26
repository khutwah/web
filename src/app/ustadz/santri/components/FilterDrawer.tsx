'use client'

import { Filter } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { useMemo, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/Button/Button'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/Drawer/Drawer'
import { UstadzFilter } from '@/app/ustadz/santri/components/UstadzFilter'
import { CheckpointStatusFilter } from '@/app/ustadz/santri/components/CheckpointStatusFilter'

import { parseSearchParams } from '@/utils/url'
import {
  CHECKPOINT_STATUS_SEARCH_PARAMS_KEY,
  USTADZ_ID_SEARCH_PARAMS_KEY
} from '@/app/ustadz/santri/constants'
import { CheckpointStatus } from '@/models/checkpoint'

type FilterFields = {
  ustadzId: number | null
  checkpointStatuses: Array<CheckpointStatus>
}

export function FilterDrawer({ children }: { children?: React.ReactNode }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const [open, setOpen] = useState(false)

  const parsedSearchParams = parseSearchParams(searchParams, {
    [USTADZ_ID_SEARCH_PARAMS_KEY]: 'number',
    [CHECKPOINT_STATUS_SEARCH_PARAMS_KEY]: 'array'
  })
  const ustadzIdParam = parsedSearchParams[USTADZ_ID_SEARCH_PARAMS_KEY]
  const checkpointStatusesParam = parsedSearchParams[
    CHECKPOINT_STATUS_SEARCH_PARAMS_KEY
  ] as Array<CheckpointStatus>

  // TODO: we might have t remove this
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

  const formMethods = useForm<FilterFields>({
    defaultValues: {
      ustadzId: ustadzIdParam,
      checkpointStatuses: checkpointStatusesParam
    }
  })

  // Update search params based on form values
  const handleUpdateFilter = (data: FilterFields) => {
    const params = new URLSearchParams(searchParams.toString())

    // Reset
    params.delete(USTADZ_ID_SEARCH_PARAMS_KEY)
    params.delete(CHECKPOINT_STATUS_SEARCH_PARAMS_KEY)

    const { ustadzId, checkpointStatuses } = data

    console.log({ ustadzId, checkpointStatuses })

    if (!!ustadzId) {
      params.set(USTADZ_ID_SEARCH_PARAMS_KEY, String(ustadzId))
    }

    if (Array.isArray(checkpointStatuses)) {
      checkpointStatuses.forEach((status) => {
        params.append(CHECKPOINT_STATUS_SEARCH_PARAMS_KEY, status)
      })
    }

    router.replace(`${pathname}?${params.toString()}`)
  }

  // Reset filter to default value
  const handleResetFilter = () => {
    formMethods.reset({
      ustadzId: null,
      checkpointStatuses: []
    })
  }

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
        <FormProvider {...formMethods}>
          <form
            onSubmit={formMethods.handleSubmit(handleUpdateFilter)}
            className='px-4 space-y-8'
          >
            <div className='space-y-3'>
              <UstadzFilter />
              <CheckpointStatusFilter />
            </div>
            <div className='flex space-x-3'>
              <Button
                className='w-full block'
                variant='outline'
                type='button'
                onClick={handleResetFilter}
              >
                Reset
              </Button>
              <Button className='w-full block' type='submit'>
                Terapkan
              </Button>
            </div>
          </form>
        </FormProvider>
        {children}
      </DrawerContent>
    </Drawer>
  )
}
