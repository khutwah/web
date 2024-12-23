import { Combobox } from '@/components/Form/Combobox'
import { InputWithLabel } from '@/components/Form/InputWithLabel'
import { Label } from '@/components/Form/Label'
import { RadioGroup, RadioGroupItem } from '@/components/Form/RadioGroup'
import { SURAH_ITEMS } from '@/models/activity-form'
import {
  LAJNAH_TYPES,
  LajnahType,
  LajnahTypeOptionsType
} from '@/models/lajnah'
import { createLajnahSchema } from '@/utils/schemas/lajnah'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, useWatch } from 'react-hook-form'
import { getVerseItems } from '../../aktivitas/utils/form'
import { ErrorField } from '@/components/Form/ErrorField'
import { Button } from '@/components/Button/Button'
import { useActionState, startTransition } from 'react'
import { createLajnah } from '../../actions'
import { useParams } from 'next/navigation'

export function AddLajnahForm() {
  const [state, formAction, isPending] = useActionState(createLajnah, undefined)
  const { slug: studentId } = useParams<{ slug: string }>()

  const form = useForm({
    resolver: yupResolver(createLajnahSchema),
    defaultValues: {
      session_type: LajnahType.default,
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

  const { session_type, start_surah, start_verse, end_surah, end_verse } =
    useWatch({
      control
    })

  const startVerseItems = getVerseItems(start_surah)
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
      <input type='hidden' {...register('student_id')} />
      <input type='hidden' {...register('start_date')} />
      <div className='flex flex-col gap-2'>
        <InputWithLabel
          label='Nama Sesi Lajnah'
          inputProps={{
            ...register('session_name'),
            id: 'session_name',
            className: 'w-full',
            type: 'text',
            placeholder: 'Masukkan nama sesi lajnah',
            required: false
          }}
        />
        <ErrorField error={errors.session_name?.message} />
      </div>
      <div className='flex flex-col gap-4'>
        <Label>Pilih tipe lajnah</Label>
        <RadioGroup
          defaultValue={LajnahType.default}
          onValueChange={(value) => {
            setValue('session_type', value as LajnahType)
            resetField('start_surah')
            resetField('start_verse')
            resetField('end_surah')
            resetField('end_verse')
          }}
        >
          {LajnahTypeOptionsType.map((item) => (
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
        {session_type && session_type !== LajnahType.custom ? (
          <div className='flex flex-col gap-4'>
            <Label>
              {session_type === LajnahType.surah_kamil_jannah
                ? 'Pilih Surat'
                : `Mulai dari ${LAJNAH_TYPES[session_type].id.label}`}
            </Label>

            {LAJNAH_TYPES[session_type].id.type === 'surah' ? (
              <Combobox
                items={SURAH_ITEMS}
                value={String(start_surah || '')}
                onChange={(value) => {
                  const id = Number(value)
                  const surah = LAJNAH_TYPES[session_type].data.find(
                    (item) => item.id === id
                  )
                  setValue('start_surah', surah?.checkpoints.start.surah!)
                  setValue('start_verse', surah?.checkpoints.start.verse!)
                  setValue('end_surah', surah?.checkpoints.end.surah!)
                  setValue('end_verse', surah?.checkpoints.end.verse!)
                }}
                placeholder='Pilih Surat'
                searchPlaceholder='Cari Surat'
              />
            ) : (
              <RadioGroup
                defaultValue={LajnahType.default}
                onValueChange={(value) => {
                  const id = Number(value)
                  const surah = LAJNAH_TYPES[session_type].data.find(
                    (item) => item.id === id
                  )
                  setValue('start_surah', surah?.checkpoints.start.surah!)
                  setValue('start_verse', surah?.checkpoints.start.verse!)
                  setValue('end_surah', surah?.checkpoints.end.surah!)
                  setValue('end_verse', surah?.checkpoints.end.verse!)
                }}
              >
                {LAJNAH_TYPES[session_type].data.map((item) => (
                  <div className='flex items-center space-x-2' key={item.id}>
                    <RadioGroupItem
                      value={String(item.id)}
                      id={String(item.id)}
                    />
                    <Label htmlFor={String(item.id)}>
                      {LAJNAH_TYPES[session_type].id.label} {item.id}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>
        ) : null}

        {session_type === LajnahType.custom ? (
          <div className='flex flex-col gap-4'>
            <div className='flex flex-row gap-4 items-end'>
              <div className='basis-3/4 flex flex-col gap-2'>
                <Label>Awal Baca</Label>
                <Combobox
                  items={SURAH_ITEMS}
                  value={String(start_surah || '')}
                  onChange={(value) => {
                    setValue('start_surah', Number(value))
                  }}
                  placeholder='Pilih Surat'
                  searchPlaceholder='Cari Surat'
                />
              </div>
              <div className='basis-1/4'>
                <Combobox
                  items={startVerseItems}
                  value={String(start_verse || '')}
                  onChange={(value) => {
                    setValue('start_verse', Number(value))
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
                  value={String(end_surah || '')}
                  onChange={(value) => {
                    setValue('end_surah', Number(value))
                  }}
                  placeholder='Pilih Surat'
                  searchPlaceholder='Cari Surat'
                />
              </div>
              <div className='basis-1/4'>
                <Combobox
                  items={endVerseItems}
                  value={String(end_verse || '')}
                  onChange={(value) => {
                    setValue('end_verse', Number(value))
                  }}
                  placeholder='Pilih Ayat'
                  searchPlaceholder='Cari Ayat'
                />
              </div>
            </div>
          </div>
        ) : null}

        <ErrorField
          error={
            errors.start_surah?.message ||
            errors.start_verse?.message ||
            errors.end_surah?.message ||
            errors.end_verse?.message ||
            state?.message
          }
        />
      </div>

      <Button
        type='submit'
        variant='primary'
        className='w-full mt-4'
        disabled={isPending}
      >
        {isPending ? 'Memulai Lajnah...' : 'Mulai Lajnah'}
      </Button>
    </form>
  )
}
