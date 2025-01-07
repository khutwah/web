'use client'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Combobox } from '@/components/Form/Combobox'
import { Label } from '@/components/Form/Label'
import { Textarea } from '@/components/Form/Textarea'
import { Tags } from './Tags'
import { Button } from '@/components/Button/Button'
import {
  ActivityFormValues,
  ActivityStatus,
  ActivityType,
  GLOBAL_TARGET_PAGE_COUNT
} from '@/models/activities'
import { activityCreateSchema } from '@/utils/schemas/activities'
import { useActivityControlledValue } from '../../hooks/useActivityControlledValue'
import { getVerseItems, toggleTag } from '../../utils/form'
import { DEFAULT_START, FormProps, SURAH_ITEMS } from '@/models/activity-form'
import { ErrorField } from '@/components/Form/ErrorField'
import { Alert, AlertDescription } from '@/components/Alert/Alert'
import { Trophy } from 'lucide-react'

import { useSubmit } from '../../hooks/useSubmit'
import { Input } from '@/components/Form/Input'
import { Submit } from './Submit'

export function FormPresent(props: FormProps) {
  const {
    activityType,
    shiftId,
    studentId,
    santriPageUri,
    lastSurah,
    lastVerse,
    defaultValues,
    activityId
  } = props
  const {
    setValue,
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<ActivityFormValues>({
    resolver: yupResolver(activityCreateSchema),
    defaultValues: {
      start_surah: lastSurah || DEFAULT_START[activityType]?.surah,
      end_surah: undefined,
      start_verse: lastVerse || DEFAULT_START[activityType]?.verse,
      end_verse: undefined,
      tags: undefined,
      notes: undefined,
      is_target_achieved: false,
      student_attendance: 'present',
      page_count: 0,
      type: activityType,
      shift_id: shiftId,
      student_id: studentId,
      target_page_count: GLOBAL_TARGET_PAGE_COUNT,
      ...defaultValues
    }
  })

  const { create, update, isLoading } = useSubmit({
    successUri: santriPageUri
  })

  const { startSurah, endSurah, startVerse, endVerse, tags, isTargetAchieved } =
    useActivityControlledValue({
      control,
      setValue,
      autofillSurah: !activityId,
      targetPageCount: defaultValues?.target_page_count
    })

  const startVerseItems = getVerseItems(startSurah)
  const endVerseItems = getVerseItems(endSurah)

  const onToggleTag = (tag: string) => {
    setValue('tags', toggleTag(tags, tag), { shouldValidate: true })
  }

  const submit = (status: ActivityStatus) => {
    setValue('status', status)
    handleSubmit(async (data) => {
      if (activityId) {
        await update(activityId, data)
      } else {
        await create(data)
      }
    })()
  }

  return (
    <form className='flex flex-col gap-6 mt-6 mb-32'>
      <div className='flex flex-col gap-2'>
        <div className='flex flex-row gap-4 items-end'>
          <div className='basis-3/4 flex flex-col gap-2'>
            <Label>Awal Baca</Label>
            <Combobox
              items={SURAH_ITEMS}
              value={String(startSurah || '')}
              onChange={(value) => {
                setValue('start_surah', Number(value), { shouldValidate: true })
                // @ts-expect-error - reset field state
                setValue('start_verse', undefined)
              }}
              placeholder='Pilih surat'
              searchPlaceholder='Cari Surat'
            />
          </div>
          <div className='basis-1/4'>
            <Combobox
              items={startVerseItems}
              value={String(startVerse || '')}
              onChange={(value) =>
                setValue('start_verse', Number(value), { shouldValidate: true })
              }
              placeholder='Pilih ayat'
              searchPlaceholder='Cari Ayat'
            />
          </div>
        </div>
        <ErrorField
          error={errors.start_surah?.message || errors.start_verse?.message}
        />
      </div>

      <div className='flex flex-col gap-2'>
        <div className='flex flex-row gap-4 items-end'>
          <div className='basis-3/4 flex flex-col gap-2'>
            <Label>Akhir Baca</Label>
            <Combobox
              items={SURAH_ITEMS}
              value={String(endSurah || '')}
              onChange={(value) => {
                setValue('end_surah', Number(value), { shouldValidate: true })
                // @ts-expect-error - reset field state
                setValue('end_verse', undefined)
              }}
              placeholder='Pilih surat'
              searchPlaceholder='Cari Surat'
            />
          </div>
          <div className='basis-1/4'>
            <Combobox
              items={endVerseItems}
              value={String(endVerse || '')}
              onChange={(value) =>
                setValue('end_verse', Number(value), { shouldValidate: true })
              }
              placeholder='Pilih ayat'
              searchPlaceholder='Cari Ayat'
            />
          </div>
        </div>
        <ErrorField
          error={errors.end_surah?.message || errors.end_verse?.message}
        />
      </div>

      <div className='flex flex-row gap-4'>
        <div className='flex flex-col gap-2 basis-4/12'>
          <Label htmlFor='page_count'>Halaman</Label>
          <Input
            {...register('page_count')}
            type='number'
            min={1}
            id='page_count'
            aria-invalid={Boolean(errors.page_count?.message)}
          />
          <ErrorField error={errors.page_count?.message} />
        </div>
        <div className='flex flex-col gap-2 basis-8/12'>
          <Label htmlFor=''>Penanda</Label>
          <Tags tags={tags ?? []} onClick={onToggleTag} />
          <ErrorField error={errors.tags?.message} />
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <Label htmlFor='notes'>Catatan Lain</Label>
        <Textarea
          {...register('notes')}
          id='notes'
          aria-invalid={Boolean(errors.notes?.message)}
        />
        <ErrorField error={errors.notes?.message} />
      </div>

      <input type='hidden' {...register('is_target_achieved')} />

      <div className='m-auto bottom-0 left-0 right-0 max-w-[500px] fixed w-full shadow-flat-top bg-white p-6 gap-4 flex flex-col'>
        {isTargetAchieved && activityType === ActivityType.Sabaq && (
          <Alert>
            <Trophy size={16} />
            <AlertDescription>
              Alhamdulillah, target hari ini tercapai
            </AlertDescription>
          </Alert>
        )}

        <div className='flex flex-row gap-2'>
          <Submit
            className='basis-1/2'
            variant='primary'
            disabled={isLoading}
            onClick={(e) => {
              e.preventDefault()
              if (isLoading) return
              submit(ActivityStatus.completed)
            }}
          />
          <Button
            className='basis-1/2'
            variant='outline'
            disabled={isLoading}
            onClick={(e) => {
              e.preventDefault()
              if (isLoading) return
              submit(ActivityStatus.draft)
            }}
          >
            Draft
          </Button>
        </div>
      </div>
    </form>
  )
}
