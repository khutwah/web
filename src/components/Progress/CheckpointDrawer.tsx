import { CheckpointStatus, FormState } from '@/models/checkpoint'
import { ErrorField } from '@/components/Form/ErrorField'

import { Button } from '../Button/Button'
import { useActionState, useEffect, useState } from 'react'
import { upsert } from './actions/checkpoints'
import { ComboboxButton } from '../Form/Combobox'
import { InputWithLabel } from '../Form/InputWithLabel'
import { Label } from '../Form/Label'

interface CheckpointDrawerProps {
  id?: number
  status?: CheckpointStatus
  parameter?: string
  lastActivityId?: number
  pageCountAccumulation?: number
  studentId?: number
}

const STATUS_LIST: Array<{ label: string; value: CheckpointStatus }> = [
  { label: 'Sedang Berhalangan', value: 'inactive' },
  {
    label: 'Mendekati Lajnah',
    value: 'lajnah-approaching'
  },
  {
    label: 'Persiapan Lajnah',
    value: 'lajnah-ready'
  },
  {
    label: 'Sedang Lajnah',
    value: 'lajnah-exam'
  },
  {
    label: 'Lajnah Selesai',
    value: 'lajnah-completed'
  }
]

export function CheckpointDrawer({
  id,
  status,
  parameter,
  lastActivityId,
  pageCountAccumulation,
  studentId
}: CheckpointDrawerProps) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    upsert,
    undefined
  )

  const [payload, setPayload] = useState({
    status,
    part_count: parameter ?? '',
    notes: parameter ?? ''
  })

  const currentStatus = STATUS_LIST.findIndex((item) => item.value === status)

  useEffect(() => {
    if (typeof state !== 'undefined' && 'success' in state && state.success) {
      window.location.reload()
    }
  }, [state])

  let message = state && 'message' in state ? state.message : ''

  if (status === 'inactive') {
    return (
      <form className='p-4' action={formAction}>
        <input type='hidden' name='id' value={id} />
        <input type='hidden' name='status' value={status} />
        <input type='hidden' name='notes' value={parameter} />
        <input type='hidden' name='end_date' value={new Date().toISOString()} />

        <Button
          variant='primary'
          type='submit'
          className='w-full'
          disabled={isPending}
        >
          Ananda Sudah Tidak Berhalangan
        </Button>
      </form>
    )
  }

  return (
    <form className='p-4 flex flex-col gap-4' action={formAction}>
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
        <Label>Status</Label>
        {STATUS_LIST.map((item, index) => (
          <ComboboxButton
            key={item.value}
            label={item.label}
            disabled={index < currentStatus && index === 0}
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

      <Button
        variant='primary'
        type='submit'
        className='w-full mt-2'
        disabled={isPending}
      >
        Submit
      </Button>
    </form>
  )
}
