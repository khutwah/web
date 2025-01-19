'use client'

import { Button } from '@/components/Button/Button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/Drawer/Drawer'
import { Plus } from 'lucide-react'
import { useActionState, useEffect, useState } from 'react'
import { addAssessmentCheckpoint } from './actions'
import { Assessments } from '@/utils/supabase/models/assessments'
import { useErrorToast } from '@/hooks/useToast'
import { useRouter } from 'next/navigation'
import { UpdateAssessmentCheckpointForm } from './UpdateAssessmentCheckpointForm'
import { Json } from '@/models/database.types'

interface Props {
  lastCheckpoint: NonNullable<
    Awaited<ReturnType<Assessments['list']>>['data']
  >[number]
  surahRange: Json
}

export function AddAssessmentCheckpoint({ lastCheckpoint, surahRange }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      {/* TODO: do we want to change the drawer title etc. as well if the final mark is filled? */}
      <DrawerTrigger asChild>
        <Button variant='primary' className='w-full'>
          <Plus aria-label='Tambah' size={16} /> Checkpoint
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Tambah Checkpoint</DrawerTitle>
          <DrawerDescription>
            Lengkapi data berikut untuk menambah checkpoint.
          </DrawerDescription>
        </DrawerHeader>

        <AddAssessmentCheckpointForm
          lastCheckpoint={lastCheckpoint}
          surahRange={surahRange}
          setOpen={setOpen}
        />
      </DrawerContent>
    </Drawer>
  )
}

type ActionState = { message?: string; isInitialLoad?: true } | undefined

function AddAssessmentCheckpointForm({
  lastCheckpoint,
  surahRange,
  setOpen
}: Props & { setOpen: (isOpen: boolean) => void }) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    addAssessmentCheckpoint,
    // Prevent the drawer from being closed by setting this initial value. If we don't provide this, then when we open the drawer,
    // it will be immediately closed because of the `useEffect` firing during the first render phase.
    { isInitialLoad: true }
  )
  const router = useRouter()

  useEffect(() => {
    if (state?.isInitialLoad) return

    if (!state?.message && !isPending) {
      // Doesn't have error and the transition has finished --> need to close drawer and refresh the page.
      setOpen(false)
      router.refresh()
    }
  }, [router, state, isPending, setOpen])
  useErrorToast(state?.message, isPending)

  return (
    <UpdateAssessmentCheckpointForm
      formAction={formAction}
      lastCheckpoint={lastCheckpoint}
      surahRange={surahRange}
      submitButton={
        <Button
          type='submit'
          variant='primary'
          className='w-full mt-4'
          disabled={isPending}
        >
          {isPending ? 'Menambahkan checkpoint...' : 'Tambah Checkpoint'}
        </Button>
      }
    />
  )
}
