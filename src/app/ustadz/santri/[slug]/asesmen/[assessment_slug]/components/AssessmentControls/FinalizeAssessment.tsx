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
import { Lock } from 'lucide-react'
import { useActionState, useEffect, useState } from 'react'
import { addAssessmentCheckpoint } from './actions'
import { Assessments } from '@/utils/supabase/models/assessments'
import { useFormContext, useWatch } from 'react-hook-form'
import { ErrorField } from '@/components/Form/ErrorField'
import { UpdateAssessmentCheckpointSchema } from '@/utils/schemas/assessments'
import { useErrorToast } from '@/hooks/useToast'
import { useRouter } from 'next/navigation'
import { UpdateAssessmentCheckpointForm } from './UpdateAssessmentCheckpointForm'
import { InferType } from 'yup'
import { Json } from '@/models/database.types'
import { StatusCheckpoint } from '@/models/checkpoints'
import { Label } from '@/components/Form/Label'
import { Combobox } from '@/components/Form/Combobox'
import { ASSESSMENT_MARKS } from '@/models/assessments'

interface Props {
  lastCheckpoint: NonNullable<
    Awaited<ReturnType<Assessments['list']>>['data']
  >[number]
  surahRange: Json
  statusCheckpoint?: StatusCheckpoint
}

export function FinalizeAssessment({
  lastCheckpoint,
  surahRange,
  statusCheckpoint
}: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant='outline' className='w-full'>
          <Lock size={16} aria-hidden /> Selesai
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Menyelesaikan Ikhtibar</DrawerTitle>
          <DrawerDescription>
            Isi formulir berikut untuk menyelesaikan ikhtibar.
          </DrawerDescription>
        </DrawerHeader>

        <AddAssessmentCheckpointForm
          statusCheckpoint={statusCheckpoint}
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
  statusCheckpoint,
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
      statusCheckpoint={statusCheckpoint}
      formAction={formAction}
      lastCheckpoint={lastCheckpoint}
      surahRange={surahRange}
      additionalFormFields={<AdditionalFormFields />}
      isPending={isPending}
    />
  )
}

function AdditionalFormFields() {
  const {
    setValue,
    control,
    formState: { errors }
  } = useFormContext<InferType<typeof UpdateAssessmentCheckpointSchema>>()

  const { final_mark } = useWatch({
    control
  })

  return (
    <div className='flex flex-col gap-2'>
      <Label>Nilai Akhir</Label>
      <Combobox
        mustSelect={true}
        items={ASSESSMENT_MARKS}
        value={`${final_mark || ''}`}
        onChange={(value) => {
          setValue('final_mark', value)
        }}
        placeholder='Pilih Nilai'
        withSearch={false}
      />
      <ErrorField error={errors.final_mark?.message} />
    </div>
  )
}
