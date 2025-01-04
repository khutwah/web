import { useActionState, useEffect, useState } from 'react'
import { Button } from '../Button/Button'
import { InputWithLabel } from '../Form/InputWithLabel'
import { FormState } from '@/models/targets'
import { updateStudent, updateCircle } from './actions/targets'
import { useRouter } from 'next/navigation'

interface TargetPageCountDrawerProps {
  id?: number
  circleId?: number
  editable?: boolean
  targetPageCount: number
  onFinish: () => void
}

export function TargetPageCountDrawer({
  id,
  circleId,
  editable,
  targetPageCount,
  onFinish
}: TargetPageCountDrawerProps) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    circleId ? updateCircle : updateStudent,
    undefined
  )

  const router = useRouter()

  const [payload, setPayload] = useState({
    target_part_count: targetPageCount ?? 0
  })

  useEffect(() => {
    if (typeof state !== 'undefined' && 'success' in state && state.success) {
      router.refresh()
      onFinish()
    }
  }, [state, router, onFinish])

  return (
    <form
      className='p-4 pt-2 flex flex-col gap-4 overflow-y-scroll max-h-[500px]'
      action={formAction}
    >
      <input type='hidden' name='id' value={circleId || id} />
      <InputWithLabel
        label='Jumlah Halaman'
        inputProps={{
          name: 'target_page_count',
          className: 'w-full',
          type: 'number',
          required: true,
          value: payload.target_part_count,
          onChange: (e) =>
            setPayload((p) => ({
              ...p,
              target_part_count: Number(e.target.value)
            }))
        }}
      />
      <div className='flex flex-row gap-2 items-center mt-2'>
        <Button
          variant='primary'
          type='submit'
          className='basis-4/5 flex-1'
          disabled={!editable || isPending}
        >
          Simpan
        </Button>
      </div>
    </form>
  )
}
