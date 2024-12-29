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
import { startTransition, useActionState, useEffect, useState } from 'react'
import { addAssessmentCheckpoint } from './actions'
import { Assessments } from '@/utils/supabase/models/assessments'
import { useForm, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { getVerseItems } from '@/app/ustadz/santri/[slug]/aktivitas/utils/form'
import { InputWithLabel } from '@/components/Form/InputWithLabel'
import { ErrorField } from '@/components/Form/ErrorField'
import { Label } from '@/components/Form/Label'
import { Combobox } from '@/components/Form/Combobox'
import { SURAH_ITEMS } from '@/models/activity-form'
import { AddAssessmentCheckpointSchema } from '@/utils/schemas/assessments'
import { useErrorToast } from '@/hooks/useToast'
import { useRouter } from 'next/navigation'

interface Props {
  lastCheckpoint: NonNullable<
    Awaited<ReturnType<Assessments['list']>>['data']
  >[number]
}

export function AddAssessmentCheckpoint({ lastCheckpoint }: Props) {
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
          <DrawerTitle>Tambah checkpoint</DrawerTitle>
          <DrawerDescription>
            Isi data berikut untuk menambah checkpoint.
          </DrawerDescription>
        </DrawerHeader>

        <AddAssessmentCheckpointForm
          lastCheckpoint={lastCheckpoint}
          setOpen={setOpen}
        />
      </DrawerContent>
    </Drawer>
  )
}

type ActionState = { message?: string; isInitialLoad?: true } | undefined

function AddAssessmentCheckpointForm({
  lastCheckpoint,
  setOpen
}: Props & { setOpen: (isOpen: boolean) => void }) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    addAssessmentCheckpoint,
    // Prevent the drawer from being closed by setting this initial value.
    { isInitialLoad: true }
  )
  const router = useRouter()

  const [start] = lastCheckpoint.surah_range as [[string], [string] | undefined]
  const [startSurah, startVerse] = start[0].split(':')

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
    resolver: yupResolver(AddAssessmentCheckpointSchema),
    defaultValues: {
      id: lastCheckpoint.id,
      student_id: lastCheckpoint.student?.id,
      ustadz_id: lastCheckpoint.ustadz?.id,
      parent_assessment_id: lastCheckpoint.parent_assessment_id!,
      start_surah: Number(startSurah),
      start_verse: Number(startVerse),
      end_surah: Number(startSurah),
      end_verse: Number(startVerse),
      final_mark: ''
    }
  })

  const {
    register,
    control,
    formState: { errors },
    setValue,
    handleSubmit
  } = form

  const { end_surah, end_verse, final_mark } = useWatch({
    control
  })

  const endVerseItems = getVerseItems(end_surah)

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
    <form
      onSubmit={onSubmit}
      className='flex flex-col gap-6 pb-8 px-4 pt-2 overflow-scroll'
    >
      <input type='hidden' {...register('id')} />
      <input type='hidden' {...register('student_id')} />
      <input type='hidden' {...register('ustadz_id')} />
      <input type='hidden' {...register('parent_assessment_id')} />
      <input type='hidden' {...register('start_surah')} />
      <input type='hidden' {...register('start_verse')} />

      <div className='flex flex-col gap-4'>
        <div className='flex flex-row gap-4 items-end'>
          <div className='basis-3/4 flex flex-col gap-2'>
            <Label>Akhir Baca</Label>
            <Combobox
              items={SURAH_ITEMS}
              value={`${end_surah}`}
              onChange={(value) => {
                setValue('end_surah', Number(value))
                setValue('end_verse', 1)
              }}
              placeholder='Pilih Surat'
              searchPlaceholder='Cari Surat'
            />
          </div>
          <div className='basis-1/4'>
            <Combobox
              items={endVerseItems}
              value={`${end_verse}`}
              onChange={(value) => {
                setValue('end_verse', Number(value))
              }}
              placeholder='Pilih Ayat'
              searchPlaceholder='Cari Ayat'
            />
          </div>
        </div>
        <ErrorField
          error={errors.end_surah?.message || errors.end_verse?.message}
        />

        <div className='flex flex-col gap-2'>
          <InputWithLabel
            label='Nilai akhir'
            inputProps={{
              ...register('final_mark'),
              id: 'final_mark',
              className: 'w-full',
              type: 'text',
              placeholder: 'Masukkan nilai akhir asesmen',
              required: false
            }}
            helperText='Setelah nilai akhir dimasukkan dan formulir ini diunggah, sesi asesmen akan berakhir dan bersifat final'
          />
          <ErrorField error={errors.final_mark?.message} />
        </div>
      </div>

      <Button
        type='submit'
        variant='primary'
        className='w-full mt-4'
        disabled={isPending}
      >
        {getButtonLoadingText(isPending, final_mark)}
      </Button>
    </form>
  )
}

function getButtonLoadingText(
  isPending: boolean,
  finalMark: string | undefined
) {
  if (!finalMark)
    return isPending ? 'Menambahkan checkpoint...' : 'Tambah checkpoint'

  return isPending ? 'Menyelesaikan asesmen...' : 'Selesaikan asesmen'
}
