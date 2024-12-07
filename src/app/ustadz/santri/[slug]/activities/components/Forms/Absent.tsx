'use client'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Label } from '@/components/Form/Label'
import { Textarea } from '@/components/Form/Textarea'
import { Button } from '@/components/Button/Button'
import {
  ActivityFormValues,
  ActivityStatus,
  GLOBAL_TARGET_PAGE
} from '@/models/activities'
import { activityCreateSchema } from '@/utils/schemas/activities'
import { FormProps } from '@/models/activity-form'
import { ErrorField } from './ErrorField'

import { useSubmit } from '../../hooks/useSubmit'

export function FormAbsent(props: Omit<FormProps, 'lastSurah' | 'lastVerse'>) {
  const {
    activityType,
    shiftId,
    studentId,
    santriPageUri,
    defaultValues,
    activityId
  } = props
  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ActivityFormValues>({
    resolver: yupResolver(activityCreateSchema),
    defaultValues: {
      notes: undefined,
      student_attendance: 'absent',
      type: activityType,
      shift_id: shiftId,
      student_id: studentId,
      target_page_count: GLOBAL_TARGET_PAGE,
      ...defaultValues
    }
  })

  const { create, update, isLoading } = useSubmit({
    successUri: santriPageUri
  })

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
        <Label>Catatan</Label>
        <Textarea {...register('notes')} className='min-h-[100px]' />
        <ErrorField error={errors.notes?.message} />
      </div>

      <div className='m-auto bottom-0 left-0 right-0 max-w-[500px] fixed w-full shadow-flat-top bg-white p-6 gap-4 flex flex-col'>
        <div className='flex flex-row gap-2'>
          <Button
            className='basis-1/2'
            variant='primary'
            disabled={isLoading}
            onClick={(e) => {
              e.preventDefault()
              if (isLoading) return
              submit(ActivityStatus.completed)
            }}
          >
            Simpan
          </Button>
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
