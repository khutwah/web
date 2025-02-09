'use client'

import { Filter } from 'lucide-react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
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

import {
  CHECKPOINT_STATUS_SEARCH_PARAMS_KEY,
  USTADZ_ID_SEARCH_PARAMS_KEY
} from '@/app/ustadz/santri/constants'
import { FilterFormData } from '@/app/ustadz/santri/models/filter-form'

type FilterDrawerProps = FilterFormData

export function FilterDrawer({
  ustadzId,
  checkpointStatuses
}: FilterDrawerProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const [open, setOpen] = useState(false)

  const filters = useMemo(() => {
    let resolvedFilters = []

    if (ustadzId) {
      resolvedFilters.push(`ustadz_id:${ustadzId}`)
    }
    if (Array.isArray(checkpointStatuses)) {
      resolvedFilters = resolvedFilters.concat(
        checkpointStatuses.map((status) => `checkpoint_status:${status}`)
      )
    }

    return resolvedFilters
  }, [ustadzId, checkpointStatuses])

  const formMethods = useForm<FilterFormData>({
    defaultValues: {
      ustadzId: ustadzId === 'ALL' || !ustadzId ? 'ALL' : ustadzId,
      checkpointStatuses
    }
  })

  const watchedCheckpointStatuses = useWatch({
    control: formMethods.control,
    name: 'checkpointStatuses'
  })

  const watchedUstadzId = useWatch({
    control: formMethods.control,
    name: 'ustadzId'
  })

  const hasFilter =
    (Array.isArray(watchedCheckpointStatuses) &&
      watchedCheckpointStatuses.length > 0) ||
    (watchedUstadzId && watchedUstadzId !== 'ALL')

  // Update search params based on form values
  const handleUpdateFilter = (data: FilterFormData) => {
    const params = new URLSearchParams(searchParams)

    // Add search params as needed
    const { ustadzId, checkpointStatuses } = data

    // Reset search params
    params.delete(CHECKPOINT_STATUS_SEARCH_PARAMS_KEY)

    params.set(USTADZ_ID_SEARCH_PARAMS_KEY, ustadzId ? String(ustadzId) : 'ALL')

    if (Array.isArray(checkpointStatuses)) {
      checkpointStatuses.forEach((status) => {
        params.append(CHECKPOINT_STATUS_SEARCH_PARAMS_KEY, status)
      })
    }

    // Apply search params without reloading the page.
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })

    setOpen(false)
  }

  // Reset filter to default value
  const handleResetFilter = () => {
    formMethods.reset({
      ustadzId: 'ALL',
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
          <span>
            Filter
            {hasFilter
              ? ` (${filters.filter((filter) => filter !== 'ustadz_id:ALL').length})`
              : ''}
          </span>
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
              <CheckpointStatusFilter
                excludes={['lajnah-assessment-completed']}
              />
            </div>
            <div className='flex space-x-3'>
              <Button
                className='w-full block'
                variant='outline'
                type='button'
                disabled={!hasFilter}
                onClick={handleResetFilter}
              >
                Hapus Filter
              </Button>
              <Button className='w-full block' type='submit'>
                Terapkan
              </Button>
            </div>
          </form>
        </FormProvider>
      </DrawerContent>
    </Drawer>
  )
}
