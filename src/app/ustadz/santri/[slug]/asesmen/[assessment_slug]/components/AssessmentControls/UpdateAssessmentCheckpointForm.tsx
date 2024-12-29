import { Button } from '@/components/Button/Button'
import { Combobox } from '@/components/Form/Combobox'
import { ErrorField } from '@/components/Form/ErrorField'
import { InputWithLabel } from '@/components/Form/InputWithLabel'
import { SURAH_ITEMS } from '@/models/activity-form'
import { UpdateAssessmentCheckpointSchema } from '@/utils/schemas/assessments'
import { Assessments } from '@/utils/supabase/models/assessments'
import { yupResolver } from '@hookform/resolvers/yup'
import { ReactNode, startTransition } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { Label } from 'recharts'
import { getVerseItems } from '../../../../aktivitas/utils/form'

interface Props {
  lastCheckpoint: NonNullable<
    Awaited<ReturnType<Assessments['list']>>['data']
  >[number]
  formAction: (formData: FormData) => void
  additionalFormFields?: ReactNode
  submitButton: ReactNode
}

export function UpdateAssessmentCheckpointForm({
  lastCheckpoint,
  formAction,
  additionalFormFields,
  submitButton
}: Props) {
  const [start] = lastCheckpoint.surah_range as [[string], [string] | undefined]
  const [startSurah, startVerse] = start[0].split(':')

  const form = useForm({
    resolver: yupResolver(UpdateAssessmentCheckpointSchema),
    defaultValues: {
      id: lastCheckpoint.id,
      student_id: lastCheckpoint.student?.id,
      ustadz_id: lastCheckpoint.ustadz?.id,
      parent_assessment_id: lastCheckpoint.parent_assessment_id!,
      notes: '',
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

  const { end_surah, end_verse } = useWatch({
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
    <FormProvider {...form}>
      <form
        onSubmit={onSubmit}
        className='flex flex-col gap-6 pb-8 px-4 pt-2 overflow-auto'
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

          <div>
            <InputWithLabel
              label='Catatan'
              inputProps={{
                ...register('notes'),
                id: 'notes',
                className: 'w-full',
                type: 'text',
                placeholder: 'Masukkan catatan',
                required: false
              }}
            />

            <ErrorField error={errors.notes?.message} />
          </div>

          {additionalFormFields}
        </div>

        {submitButton}
      </form>
    </FormProvider>
  )
}
