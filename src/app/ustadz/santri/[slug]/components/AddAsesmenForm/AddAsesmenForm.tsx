import { Combobox } from '@/components/Form/Combobox'
import { Label } from '@/components/Form/Label'
import { SURAH_ITEMS } from '@/models/activity-form'
import surahs from '@/data/mushaf/surahs.json'
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
import { useActionState, startTransition, useEffect } from 'react'
import { createAssessment } from '../../actions'
import { useParams } from 'next/navigation'
import {
  getAssessmentRangeItems,
  parseRangeValue,
  getSurahDetailFromSurahRange,
  checkSurahDetail,
  customSurahRangeSessionName
} from '@/utils/assessments'
import { InferType } from 'yup'
import { ROLE } from '@/models/auth'

interface AddAsesmenProps {
  role: number
  sessionRangeId?: number
  statusCheckpointId?: number
}

export function AddAsesmenForm({
  role,
  sessionRangeId,
  statusCheckpointId
}: AddAsesmenProps) {
  const [state, formAction, isPending] = useActionState(
    createAssessment,
    undefined
  )
  const { slug: studentId } = useParams<{ slug: string }>()
  const form = useForm({
    resolver: yupResolver(assessmentSchema),
    defaultValues: {
      start_date: new Date().toISOString(),
      student_id: Number(studentId),

      // The following are complicated setup.
      // FIXME(dio): Refactor this to be more readable.
      session_name:
        role == ROLE.LAJNAH
          ? (() => {
              const { data } = ASSESSMENT_TYPES[AssessmentType.lajnah]
              const assessment = data.find(
                (range) => range.id === sessionRangeId
              )
              return assessment?.ranges
                .map((range) =>
                  range.start.juz != range.end.juz
                    ? 'Juz ' + range.start.juz + ' - Juz ' + range.end.juz
                    : 'Juz ' + range.start.juz
                )
                .join(' dan ')
            })()
          : undefined,
      session_type: role === ROLE.LAJNAH ? AssessmentType.lajnah : undefined,
      session_range_id: role === ROLE.LAJNAH ? sessionRangeId : undefined,
      surah_range:
        role == ROLE.LAJNAH && sessionRangeId
          ? (() => {
              const { data } = ASSESSMENT_TYPES[AssessmentType.lajnah]
              const assessment = data.find(
                (range) => range.id === sessionRangeId
              )
              if (!assessment) return undefined
              return parseRangeValue(assessment.ranges)
            })()
          : undefined,
      status_checkpoint_id: statusCheckpointId
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

  const { session_type, session_range_id, session_name, surah_range } =
    useWatch({
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

  useEffect(() => {
    if (role === ROLE.LAJNAH && sessionRangeId) {
      setValue('session_range_id', sessionRangeId)
    } else {
      resetField('session_range_id')
    }
  }, [role, sessionRangeId, setValue, resetField])

  return (
    <form
      onSubmit={onSubmit}
      className='flex flex-col gap-6 pb-8 px-4 pt-2 overflow-scroll'
    >
      <input type='hidden' {...register('student_id')} />
      <input type='hidden' {...register('start_date')} />

      <div className='flex flex-col gap-2'>
        <Label>Jenis Ikhtibar</Label>
        <Combobox
          withSearch={false}
          mustSelect={role === ROLE.LAJNAH}
          disabled={role === ROLE.LAJNAH}
          items={AssessmentTypeOptions.filter((typeOption) =>
            typeOption.value === AssessmentType.lajnah
              ? ROLE.LAJNAH === role
              : ROLE.LAJNAH !== role
          )}
          value={session_type || ''}
          onChange={(value) => {
            setValue('session_type', value as AssessmentType)
            setValue('surah_range', '')
            setValue('session_name', '')
            setValue('session_range_id', undefined)
            resetField('surah_range')
            resetField('session_name')
          }}
          placeholder='Pilih Jenis Ikhtibar'
        />
      </div>

      <div className='flex flex-col gap-2'>
        {session_type && session_type !== AssessmentType.custom && (
          <PredefinedAssessmentRange
            sessionRangeId={session_range_id}
            sessionType={session_type}
            setValue={setValue}
          />
        )}

        {session_type === AssessmentType.custom && (
          <CustomAssessmentRange surahRange={surah_range} setValue={setValue} />
        )}

        <ErrorField
          error={
            errors.session_name?.message ||
            errors.session_range_id?.message ||
            errors.surah_range?.message ||
            state?.message
          }
        />
      </div>

      <Button
        type='submit'
        variant='primary'
        className='w-full mt-4'
        disabled={
          isPending ||
          !session_type ||
          session_range_id === undefined ||
          !session_name
        }
      >
        {isPending ? 'Memulai Ikhtibar...' : `Mulai Ikhtibar`}
      </Button>
    </form>
  )
}

type AssessmentFormValues = InferType<typeof assessmentSchema>

function PredefinedAssessmentRange({
  sessionType,
  sessionRangeId,
  setValue
}: {
  sessionType: AssessmentType
  sessionRangeId: number | undefined
  setValue: UseFormSetValue<AssessmentFormValues>
}) {
  const { data, id } = ASSESSMENT_TYPES[sessionType]

  return (
    <div className='flex flex-col gap-4'>
      <Label>Materi Ikhtibar</Label>
      <Combobox
        withSearch={id.type === 'surah'}
        mustSelect={true}
        items={getAssessmentRangeItems(data, id.type)}
        value={`${sessionRangeId || ''}`}
        onChange={(value) => {
          if (!value) {
            setValue('surah_range', '')
            setValue('session_name', '')
            setValue('session_range_id', undefined)
            return
          }

          const rangeId = Number(value)
          const assessment = data.find((range) => range.id === rangeId)

          if (assessment) {
            // Set session_name based on the selected session_type, session_range_id, and surah_range.
            const assessmentType = ASSESSMENT_TYPES[sessionType]

            const session_name =
              assessmentType.id.type === 'juz'
                ? assessment?.ranges
                    .map((range) =>
                      range.start.juz != range.end.juz
                        ? 'Juz ' + range.start.juz + ' - Juz ' + range.end.juz
                        : 'Juz ' + range.start.juz
                    )
                    .join(' dan ')
                : `Surat ${surahs.find(({ id }) => id === assessment.ranges[0].start.surah)?.name}`

            setValue('session_name', session_name || `${assessmentType.title}`)
            setValue('surah_range', parseRangeValue(assessment.ranges))
            setValue('session_range_id', rangeId)
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
          <Label>Awal Materi Ikhtibar {surahDetail.start_verse[0]}</Label>
          <Combobox
            items={SURAH_ITEMS}
            value={surahDetail.start_surah[0]}
            onChange={(value) => {
              if (!value) {
                setValue(
                  'surah_range',
                  JSON.stringify([
                    [
                      `:`,
                      `${surahDetail.end_surah[0] || ''}:${surahDetail.end_verse[0] || ''}`
                    ]
                  ])
                )
                setValue('session_name', '')
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
              setValue(
                'session_name',
                customSurahRangeSessionName(
                  value,
                  surahDetail.start_verse[0],
                  surahDetail.end_surah[0],
                  surahDetail.end_verse[0]
                )
              )
              setValue('session_range_id', checkSurahDetail(surahDetail))
            }}
            placeholder='Pilih surat'
            searchPlaceholder='Cari Surat'
          />
        </div>
        <div className='basis-1/4'>
          <Combobox
            items={startVerseItems}
            value={surahDetail.start_verse[0] || ''}
            onChange={(value) => {
              if (!value) {
                setValue(
                  'surah_range',
                  JSON.stringify([
                    [
                      `${surahDetail.start_surah[0] || ''}:`,
                      `${surahDetail.end_surah[0] || ''}:${surahDetail.end_verse[0] || ''}`
                    ]
                  ])
                )
                setValue('session_name', '')
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
              setValue(
                'session_name',
                customSurahRangeSessionName(
                  surahDetail.start_surah[0],
                  value,
                  surahDetail.end_surah[0],
                  surahDetail.end_verse[0]
                )
              )
              setValue('session_range_id', checkSurahDetail(surahDetail))
            }}
            placeholder='Pilih ayat'
            searchPlaceholder='Cari Ayat'
          />
        </div>
      </div>
      <div className='flex flex-row gap-4 items-end'>
        <div className='basis-3/4 flex flex-col gap-2'>
          <Label>Akhir Materi Ikhtibar</Label>
          <Combobox
            items={SURAH_ITEMS}
            value={surahDetail.end_surah[0]}
            onChange={(value) => {
              if (!value) {
                setValue(
                  'surah_range',
                  JSON.stringify([
                    [
                      `${surahDetail.start_surah[0] || ''}:${surahDetail.start_verse[0] || ''}`,
                      `:`
                    ]
                  ])
                )
                setValue('session_name', '')
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
              setValue(
                'session_name',
                customSurahRangeSessionName(
                  surahDetail.start_surah[0],
                  surahDetail.start_verse[0],
                  value,
                  surahDetail.end_verse[0]
                )
              )
              setValue('session_range_id', checkSurahDetail(surahDetail))
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
                setValue(
                  'surah_range',
                  JSON.stringify([
                    [
                      `${surahDetail.start_surah[0] || ''}:${surahDetail.start_verse[0] || ''}`,
                      `${surahDetail.end_surah[0] || ''}:`
                    ]
                  ])
                )
                setValue('session_name', '')
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
              setValue(
                'session_name',
                customSurahRangeSessionName(
                  surahDetail.start_surah[0],
                  surahDetail.start_verse[0],
                  surahDetail.end_surah[0],
                  value
                )
              )
              setValue('session_range_id', checkSurahDetail(surahDetail))
            }}
            placeholder='Pilih ayat'
            searchPlaceholder='Cari Ayat'
          />
        </div>
      </div>
    </div>
  )
}
