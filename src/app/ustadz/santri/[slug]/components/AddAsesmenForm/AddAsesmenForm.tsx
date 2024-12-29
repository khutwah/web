import { Combobox } from '@/components/Form/Combobox'
import { InputWithLabel } from '@/components/Form/InputWithLabel'
import { Label } from '@/components/Form/Label'
import { SURAH_ITEMS } from '@/models/activity-form'
import {
  ASSESSMENT_TYPES,
  AssessmentType,
  AssessmentTypeOptions
} from '@/models/assessments'
import { assessmentSchema } from '@/utils/schemas/assessments'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, UseFormSetValue, useWatch } from 'react-hook-form'
import { getVerseItems } from '../../aktivitas/utils/form'
import { ErrorField } from '@/components/Form/ErrorField'
import { Button } from '@/components/Button/Button'
import { useActionState, startTransition } from 'react'
import { createAssessment } from '../../actions'
import { useParams } from 'next/navigation'
import {
  getAssessmentRangeId,
  getAssessmentRangeItems,
  parseRangeValue,
  getSurahDetailFromSurahRange
} from '@/utils/assessments'
import { InferType } from 'yup'

export function AddAsesmenForm() {
  const [state, formAction, isPending] = useActionState(
    createAssessment,
    undefined
  )
  const { slug: studentId } = useParams<{ slug: string }>()

  const form = useForm({
    resolver: yupResolver(assessmentSchema),
    defaultValues: {
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
            placeholder: 'Misalnya: Ujian Juz 30',
            required: false
          }}
        />
        <ErrorField error={errors.session_name?.message} />
      </div>
      <div className='flex flex-col gap-2'>
        <Label>Jenis Asesmen</Label>
        <Combobox
          withSearch={false}
          items={AssessmentTypeOptions}
          value={session_type || ''}
          onChange={(value) => {
            setValue('session_type', value as AssessmentType)
            setValue('surah_range', '')
            resetField('surah_range')
          }}
          placeholder='Pilih jenis asesmen'
        />
      </div>

      <div className='flex flex-col gap-2'>
        {session_type && session_type !== AssessmentType.custom && (
          <PredefinedAssessmentRange
            surahRange={surah_range}
            sessionType={session_type}
            setValue={setValue}
          />
        )}

        {session_type === AssessmentType.custom && (
          <CustomAssessmentRange surahRange={surah_range} setValue={setValue} />
        )}

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

type AssessmentFormValues = InferType<typeof assessmentSchema>

function PredefinedAssessmentRange({
  sessionType,
  surahRange,
  setValue
}: {
  sessionType: AssessmentType
  surahRange: string | undefined
  setValue: UseFormSetValue<AssessmentFormValues>
}) {
  const { data, id } = ASSESSMENT_TYPES[sessionType]
  const assessmentRangeId = getAssessmentRangeId(sessionType, surahRange, data)

  return (
    <div className='flex flex-col gap-4'>
      <Label>Materi Asesmen</Label>
      <Combobox
        withSearch={id.type === 'surah'}
        items={getAssessmentRangeItems(data, id.type)}
        value={assessmentRangeId}
        onChange={(value) => {
          if (!value) {
            setValue('surah_range', '')
            return
          }

          const id = Number(value)
          const assessment = data.find((item) => item.id === id)

          if (assessment) {
            setValue('surah_range', parseRangeValue(assessment.ranges))
          }
        }}
        placeholder={`Pilih ${id.label}`}
        searchPlaceholder={`Cari ${id.label}`}
      />
    </div>
  )
}

function CustomAssessmentRange({
  surahRange,
  setValue
}: {
  surahRange: string | undefined
  setValue: UseFormSetValue<AssessmentFormValues>
}) {
  const surahDetail = getSurahDetailFromSurahRange(surahRange)
  const startVerseItems = getVerseItems(Number(surahDetail.start_surah[0]))
  const endVerseItems = getVerseItems(Number(surahDetail.end_surah[0]))

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-row gap-4 items-end'>
        <div className='basis-3/4 flex flex-col gap-2'>
          <Label>Awal Materi Asesmen</Label>
          <Combobox
            items={SURAH_ITEMS}
            value={surahDetail.start_surah[0]}
            onChange={(value) => {
              if (!value) {
                setValue('surah_range', '')
                return
              }
              setValue(
                'surah_range',
                JSON.stringify([
                  [
                    `${value}:${surahDetail.start_verse[0] || ''}`,
                    `${surahDetail.end_surah[0] || ''}:${surahDetail.end_verse[0] || ''}`
                  ]
                ])
              )
            }}
            placeholder='Pilih surat'
            searchPlaceholder='Cari Surat'
          />
        </div>
        <div className='basis-1/4'>
          <Combobox
            items={startVerseItems}
            value={surahDetail.start_verse[0]}
            onChange={(value) => {
              if (!value) {
                setValue('surah_range', '')
                return
              }
              setValue(
                'surah_range',
                JSON.stringify([
                  [
                    `${surahDetail.start_surah[0] || ''}:${value}`,
                    `${surahDetail.end_surah[0] || ''}:${surahDetail.end_verse[0] || ''}`
                  ]
                ])
              )
            }}
            placeholder='Pilih ayat'
            searchPlaceholder='Cari Ayat'
          />
        </div>
      </div>
      <div className='flex flex-row gap-4 items-end'>
        <div className='basis-3/4 flex flex-col gap-2'>
          <Label>Akhir Materi Asesmen</Label>
          <Combobox
            items={SURAH_ITEMS}
            value={surahDetail.end_surah[0]}
            onChange={(value) => {
              if (!value) {
                setValue('surah_range', '')
                return
              }
              setValue(
                'surah_range',
                JSON.stringify([
                  [
                    `${surahDetail.start_surah[0] || ''}:${surahDetail.start_verse[0] || ''}`,
                    `${value}:${surahDetail.end_verse[0] || ''}`
                  ]
                ])
              )
            }}
            placeholder='Pilih surat'
            searchPlaceholder='Cari Surat'
          />
        </div>
        <div className='basis-1/4'>
          <Combobox
            items={endVerseItems}
            value={surahDetail.end_verse[0]}
            onChange={(value) => {
              if (!value) {
                setValue('surah_range', '')
                return
              }
              setValue(
                'surah_range',
                JSON.stringify([
                  [
                    `${surahDetail.start_surah[0] || ''}:${surahDetail.start_verse[0] || ''}`,
                    `${surahDetail.end_surah[0] || ''}:${value}`
                  ]
                ])
              )
            }}
            placeholder='Pilih ayat'
            searchPlaceholder='Cari Ayat'
          />
        </div>
      </div>
    </div>
  )
}
