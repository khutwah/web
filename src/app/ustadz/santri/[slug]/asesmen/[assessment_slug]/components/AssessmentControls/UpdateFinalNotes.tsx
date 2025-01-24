'use client'

import { Button } from '@/components/Button/Button'
import { Pencil, Plus } from 'lucide-react'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/Drawer/Drawer'
import { startTransition, useActionState, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { UpdateFinalNotesSchema } from '@/utils/schemas/assessments'
import { updateFinalNotes } from './actions'
import { Textarea } from '@/components/Form/Textarea'
import { Label } from '@/components/Form/Label'
import { useRouter } from 'next/navigation'
import { useErrorToast } from '@/hooks/useToast'

interface UpdateFinalNotesProps {
  id?: number
  name?: string | null
  notes?: string | null
  mistakes?: {
    low?: number
    high?: number
  }
}

export function UpdateFinalNotes({
  id,
  name,
  notes,
  mistakes
}: UpdateFinalNotesProps) {
  const [open, setOpen] = useState(false)

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant='outline'>
          {notes ? <Pencil /> : <Plus />}
          Catatan Akhir
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Catatan Akhir</DrawerTitle>
          <DrawerDescription>
            Isi catatan akhir untuk ikhtibar {name} ini.
          </DrawerDescription>
        </DrawerHeader>
        <UpdateFinalNotesForm
          id={id}
          notes={notes ?? ''}
          mistakes={mistakes}
          setOpen={setOpen}
        />
      </DrawerContent>
    </Drawer>
  )
}

type ActionState = { message?: string; isInitialLoad?: true } | undefined

function UpdateFinalNotesForm({
  id,
  notes,
  mistakes,
  setOpen
}: UpdateFinalNotesProps & { setOpen: (isOpen: boolean) => void }) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    updateFinalNotes,
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

  const form = useForm({
    resolver: yupResolver(UpdateFinalNotesSchema),
    defaultValues: {
      notes,
      id
    }
  })

  const { register, handleSubmit } = form

  const onSubmit = handleSubmit((payload) => {
    const formData = new FormData()
    for (const key in payload) {
      const value = payload[key as keyof typeof payload]!
      formData.set(key, value.toString())
    }

    startTransition(() => {
      formAction(formData)
    })
  })

  return (
    <>
      <div className='flex flex-col pb-2 px-4 pt-2 overflow-auto'>
        <Label>Catatan kesalahan</Label>
        <div className='mt-2 flex gap-2 text-khutwah-neutral-white'>
          <div className='h-6 w-6 rounded-full flex items-center justify-center text-khutwah-sm-regular text-khutwah-warning-70 border border-khutwah-warning-70'>
            {mistakes?.low || 0}
          </div>
          <div className='h-6 w-6 rounded-full flex items-center justify-center text-khutwah-sm-regular text-khutwah-warning-70 border border-khutwah-warning-70'>
            {mistakes?.high || 0}
          </div>
        </div>
      </div>
      <FormProvider {...form}>
        <form
          onSubmit={onSubmit}
          className='flex flex-col gap-6 pb-8 px-4 pt-2 overflow-auto'
        >
          <div className='flex flex-col gap-4'>
            <Textarea {...register('notes')} id='notes' />
            <Button
              type='submit'
              variant='primary'
              className='w-full mt-4'
              disabled={isPending}
            >
              {isPending ? 'Sedang Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  )
}
