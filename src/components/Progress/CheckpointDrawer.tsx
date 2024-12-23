import { CheckpointStatus, FormState, STATUS_LIST } from '@/models/checkpoint'
import { ErrorField } from '@/components/Form/ErrorField'

import { Button } from '../Button/Button'
import { useActionState, useEffect, useRef, useState } from 'react'
import { upsert } from './actions/checkpoints'
import { ComboboxButton } from '../Form/Combobox'
import { InputWithLabel } from '../Form/InputWithLabel'
import { CheckpointDeleteConfirm } from './CheckpointDeleteConfirm'
import { useRouter } from 'next/navigation'

interface CheckpointDrawerProps {
  id?: number
  status?: CheckpointStatus
  lastActivityId?: number | null
  pageCountAccumulation?: number | null
  studentId?: number | null
  onFinish: () => void
  notes?: string | null
  partCount?: number | null
}

export function CheckpointDrawer({
  id,
  status,
  lastActivityId,
  pageCountAccumulation,
  studentId,
  onFinish,
  notes,
  partCount
}: CheckpointDrawerProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    upsert,
    undefined
  )

  const router = useRouter()

  const [payload, setPayload] = useState({
    status,
    part_count: partCount ?? '',
    notes: notes ?? ''
  })

  useEffect(() => {
    if (typeof state !== 'undefined' && 'success' in state && state.success) {
      router.refresh()
      onFinish()
    }
  }, [state, router, onFinish])

  const message = state && 'message' in state ? state.message : ''

  const onDeleteConfirmed = () => {
    if (formRef.current) {
      if (!document.getElementsByName('end_date').length) {
        const endDate = document.createElement('input')
        endDate.type = 'hidden'
        endDate.name = 'end_date'
        endDate.value = new Date().toISOString()
        formRef.current.appendChild(endDate)
      }

      formRef.current.requestSubmit()
    }
  }

  return (
    <form
      className='p-4 pt-2 flex flex-col gap-4 overflow-y-scroll max-h-[500px]'
      action={formAction}
      ref={formRef}
    >
      {id ? <input type='hidden' name='id' value={id} /> : null}

      {studentId ? (
        <input type='hidden' name='student_id' value={studentId} />
      ) : null}

      {!id ? (
        <input
          type='hidden'
          name='start_date'
          value={new Date().toISOString()}
        />
      ) : null}

      {lastActivityId ? (
        <input type='hidden' name='last_activity_id' value={lastActivityId} />
      ) : null}

      {pageCountAccumulation ? (
        <input
          type='hidden'
          name='page_count_accumulation'
          value={pageCountAccumulation}
        />
      ) : null}

      {payload.status === 'lajnah-completed' ? (
        <input type='hidden' name='end_date' value={new Date().toISOString()} />
      ) : null}

      <div className='flex flex-col gap-2'>
        {STATUS_LIST.filter(
          (status) => lastActivityId ?? status.value === 'inactive'
        ).map((item) => (
          <ComboboxButton
            key={item.value}
            label={item.label}
            checked={item.value === payload.status}
            inputProps={{ value: item.value, name: 'status' }}
            onClick={() =>
              setPayload((p) => ({
                ...p,
                status: item.value
              }))
            }
          />
        ))}
      </div>

      {payload.status === 'inactive' ? (
        <InputWithLabel
          label='Catatan'
          inputProps={{
            id: 'notes',
            name: 'notes',
            className: 'w-full',
            type: 'text',
            required: true,
            value: payload.notes,
            onChange: (e) =>
              setPayload((p) => ({ ...p, notes: e.target.value }))
          }}
        />
      ) : null}

      {payload.status && payload.status !== 'inactive' ? (
        <InputWithLabel
          label='Jumlah Juz'
          inputProps={{
            id: 'part_count',
            name: 'part_count',
            className: 'w-full',
            type: 'number',
            required: true,
            value: payload.part_count,
            onChange: (e) =>
              setPayload((p) => ({ ...p, part_count: e.target.value })),
            min: 1
          }}
        />
      ) : null}

      {message ? <ErrorField error={message} /> : null}

      <div className='flex flex-row gap-2 items-center mt-2'>
        <Button
          variant='primary'
          type='submit'
          className='basis-4/5 flex-1'
          disabled={isPending}
        >
          Simpan
        </Button>
        {id ? (
          <CheckpointDeleteConfirm
            variant='outline'
            className='basis-1/5'
            onClick={onDeleteConfirmed}
          />
        ) : null}
      </div>
    </form>
  )
}
