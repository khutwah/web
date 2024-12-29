import { Combobox } from '@/components/Form/Combobox'
import { InputWithLabel } from '@/components/Form/InputWithLabel'
import { Label } from '@/components/Form/Label'
import { RadioGroup, RadioGroupItem } from '@/components/Form/RadioGroup'
import { SURAH_ITEMS } from '@/models/activity-form'
import {
  ASSESSMENT_TYPES,
  AssessmentType,
  AssessmentTypeOptionsType
} from '@/models/assessments'
import { assessmentSchema } from '@/utils/schemas/assessments'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, useWatch } from 'react-hook-form'
import { getVerseItems } from '../../aktivitas/utils/form'
import { ErrorField } from '@/components/Form/ErrorField'
import { Button } from '@/components/Button/Button'
import { useActionState, startTransition } from 'react'
import { createAssessment } from '../../actions'
import { useParams } from 'next/navigation'
import { getSurahDetailFromSurahRange } from '@/utils/get-surah-detail-from-surah-range'
import { parseCheckpointLabel, parseCheckpointValue } from '@/utils/assessments'

export function AddAsesmenForm() {
  const [state, formAction, isPending] = useActionState(
    createAssessment,
    undefined
  )
  const { slug: studentId } = useParams<{ slug: string }>()

  const form = useForm({
    resolver: yupResolver(assessmentSchema),
    defaultValues: {
      session_type: AssessmentType.default,
      start_date: new Date().toISOString(),
      student_id: Number(studentId)
    }
  })

  const {
    register,
    control,
    formState: { errors },
    setValue,
    resetField,
    handleSubmit
  } = form

  const { session_type, surah_range } = useWatch({
    control
  })

  const surahDetail = getSurahDetailFromSurahRange(surah_range)

  const startVerseItems = getVerseItems(Number(surahDetail.start_surah[0]))
  const endVerseItems = getVerseItems(Number(surahDetail.end_surah[0]))

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
      <input type='hidden' {...register('student_id')} />
      <input type='hidden' {...register('start_date')} />
      <div className='flex flex-col gap-2'>
        <InputWithLabel
          label='Nama Sesi Asesmen'
          inputProps={{
            ...register('session_name'),
            id: 'session_name',
            className: 'w-full',
            type: 'text',
            placeholder: 'Masukkan nama sesi asesmen',
            required: false
          }}
        />
        <ErrorField error={errors.session_name?.message} />
      </div>
      <div className='flex flex-col gap-4'>
        <Label>Pilih tipe asesmen</Label>
        <RadioGroup
          defaultValue={AssessmentType.default}
          onValueChange={(value) => {
            setValue('session_type', value as AssessmentType)
            resetField('surah_range')
          }}
        >
          {AssessmentTypeOptionsType.map((item) => (
            <div className='flex items-center space-x-2' key={item.value}>
              <RadioGroupItem
                value={item.value}
                id={item.value}
                checked={session_type === item.value}
              />
              <Label htmlFor={item.value}>{item.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className='flex flex-col gap-2'>
        {session_type && session_type !== AssessmentType.custom ? (
          <div className='flex flex-col gap-4'>
            <Label>
              {session_type === AssessmentType.per_surah
                ? 'Pilih Surat'
                : `Pilih Materi (Juz)`}
            </Label>

            {ASSESSMENT_TYPES[session_type].id.type === 'surah' ? (
              <Combobox
                items={SURAH_ITEMS}
                value={surahDetail.start_surah[0]}
                onChange={(value) => {
                  const id = Number(value)
                  const surah = ASSESSMENT_TYPES[session_type].data.find(
                    (item) => item.id === id
                  )
                  if (surah) {
                    setValue('surah_range', parseCheckpointValue(surah.ranges))
                  }
                }}
                placeholder='Pilih Surat'
                searchPlaceholder='Cari Surat'
              />
            ) : (
              <RadioGroup
                defaultValue={AssessmentType.default}
                onValueChange={(value) => {
                  const id = Number(value)
                  const surah = ASSESSMENT_TYPES[session_type].data.find(
                    (item) => item.id === id
                  )
                  if (surah) {
                    setValue('surah_range', parseCheckpointValue(surah.ranges))
                  }
                }}
              >
                {ASSESSMENT_TYPES[session_type].data.map((item) => (
                  <div className='flex items-center space-x-2' key={item.id}>
                    <RadioGroupItem
                      value={String(item.id)}
                      id={String(item.id)}
                    />
                    <Label htmlFor={String(item.id)}>
                      {parseCheckpointLabel(item.ranges)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>
        ) : null}

        {session_type === AssessmentType.custom ? (
          <div className='flex flex-col gap-4'>
            <div className='flex flex-row gap-4 items-end'>
              <div className='basis-3/4 flex flex-col gap-2'>
                <Label>Awal Baca</Label>
                <Combobox
                  items={SURAH_ITEMS}
                  value={surahDetail.start_surah[0]}
                  onChange={(value) => {
                    setValue(
                      'surah_range',
                      JSON.stringify([
                        [
                          `${value}:${surahDetail.start_verse[0]}`,
                          `${surahDetail.end_surah[0]}:${surahDetail.end_verse[0]}`
                        ]
                      ])
                    )
                  }}
                  placeholder='Pilih Surat'
                  searchPlaceholder='Cari Surat'
                />
              </div>
              <div className='basis-1/4'>
                <Combobox
                  items={startVerseItems}
                  value={surahDetail.start_verse[0]}
                  onChange={(value) => {
                    setValue(
                      'surah_range',
                      JSON.stringify([
                        [
                          `${surahDetail.start_surah[0]}:${value}`,
                          `${surahDetail.end_surah[0]}:${surahDetail.end_verse[0]}`
                        ]
                      ])
                    )
                  }}
                  placeholder='Pilih Ayat'
                  searchPlaceholder='Cari Ayat'
                />
              </div>
            </div>
            <div className='flex flex-row gap-4 items-end'>
              <div className='basis-3/4 flex flex-col gap-2'>
                <Label>Akhir Baca</Label>
                <Combobox
                  items={SURAH_ITEMS}
                  value={surahDetail.end_surah[0]}
                  onChange={(value) => {
                    setValue(
                      'surah_range',
                      JSON.stringify([
                        [
                          `${surahDetail.start_surah[0]}:${surahDetail.start_verse[0]}`,
                          `${value}:${surahDetail.end_verse[0]}`
                        ]
                      ])
                    )
                  }}
                  placeholder='Pilih Surat'
                  searchPlaceholder='Cari Surat'
                />
              </div>
              <div className='basis-1/4'>
                <Combobox
                  items={endVerseItems}
                  value={surahDetail.end_verse[0]}
                  onChange={(value) => {
                    setValue(
                      'surah_range',
                      JSON.stringify([
                        [
                          `${surahDetail.start_surah[0]}:${surahDetail.start_verse[0]}`,
                          `${surahDetail.end_surah[0]}:${value}`
                        ]
                      ])
                    )
                  }}
                  placeholder='Pilih Ayat'
                  searchPlaceholder='Cari Ayat'
                />
              </div>
            </div>
          </div>
        ) : null}

        <ErrorField error={errors.surah_range?.message || state?.message} />
      </div>

      <Button
        type='submit'
        variant='primary'
        className='w-full mt-4'
        disabled={isPending}
      >
        {isPending ? 'Memulai Asesmen...' : 'Mulai Asesmen'}
      </Button>
    </form>
  )
}
