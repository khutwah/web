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
import { Flame } from 'lucide-react'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { getVerseItems } from '../../aktivitas/utils/form'
import { ErrorField } from '@/components/Form/ErrorField'

export function AddLajnah() {
  const [open, setOpen] = useState(false)

  const {
    register,
    control,
    formState: { errors },
    setValue
  } = useForm({
    resolver: yupResolver(createLajnahSchema),
    defaultValues: {
      session_type: LajnahType.default
    }
  })

  const { session_type, start_surah, start_verse, end_surah, end_verse } =
    useWatch({
      control
    })

  const startVerseItems = getVerseItems(start_surah)
  const endVerseItems = getVerseItems(end_surah)

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant='primary' className='w-full'>
          <Flame size={16} /> Mulai Lajnah
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Mulai Lajnah</DrawerTitle>
          <DrawerDescription>
            Isi data berikut untuk memulai lajnah.
          </DrawerDescription>
        </DrawerHeader>
        <form className='pb-8 px-4 gap-6'>
          <div>
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
          </div>
          <div className='flex flex-col gap-4'>
            <Label>Pilih tipe lajnah</Label>
            <RadioGroup
              defaultValue={LajnahType.default}
              onValueChange={(value) => {
                setValue('session_type', value as LajnahType)
                setValue('start_surah', undefined)
                setValue('start_verse', undefined)
                setValue('end_surah', undefined)
                setValue('end_verse', undefined)
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

          {session_type && session_type !== LajnahType.custom ? (
            <div className='flex flex-col gap-4'>
              <Label>Mulai dari {LAJNAH_TYPES[session_type].id.label}</Label>

              {LAJNAH_TYPES[session_type].id.type === 'surah' ? (
                <div>
                  <Label>Pilih Surah</Label>
                  <Combobox
                    items={SURAH_ITEMS}
                    value={String(start_surah || '')}
                    onChange={(value) => {
                      const id = Number(value)
                      const surah = LAJNAH_TYPES[session_type].data.find(
                        (item) => item.id === id
                      )
                      setValue('start_surah', surah?.checkpoints.start.surah)
                      setValue('start_verse', surah?.checkpoints.start.verse)
                      setValue('end_surah', surah?.checkpoints.end.surah)
                      setValue('end_verse', surah?.checkpoints.end.verse)
                    }}
                    placeholder='Pilih Surat'
                    searchPlaceholder='Cari Surat'
                  />
                </div>
              ) : (
                <RadioGroup
                  defaultValue={LajnahType.default}
                  onValueChange={(value) => {
                    const id = Number(value)
                    const surah = LAJNAH_TYPES[session_type].data.find(
                      (item) => item.id === id
                    )
                    setValue('start_surah', surah?.checkpoints.start.surah)
                    setValue('start_verse', surah?.checkpoints.start.verse)
                    setValue('end_surah', surah?.checkpoints.end.surah)
                    setValue('end_verse', surah?.checkpoints.end.verse)
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
            <div>
              <div className='flex flex-col gap-2'>
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
                <ErrorField
                  error={
                    errors.start_surah?.message || errors.start_verse?.message
                  }
                />
              </div>
              <div className='flex flex-col gap-2'>
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
                <ErrorField
                  error={errors.end_surah?.message || errors.end_verse?.message}
                />
              </div>
            </div>
          ) : null}
        </form>
      </DrawerContent>
    </Drawer>
  )
}
