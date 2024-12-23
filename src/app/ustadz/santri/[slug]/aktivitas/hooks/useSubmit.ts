import { useRouter } from 'next/navigation'
import { create, update } from '../utils/submit'
import { useState, useTransition } from 'react'
import { addQueryParams } from '@/utils/url'

export function useSubmit({ successUri }: { successUri: string }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isLoading, startTransition] = useTransition()

  const _create = async (...args: Parameters<typeof create>) => {
    startTransition(async () => {
      const response = await create(...args)

      if (response.success) {
        router.replace(
          addQueryParams(successUri, { create_activity_success: 'true' })
        )
      } else {
        setError(response.message ?? '')
      }
    })
  }

  const _update = async (...args: Parameters<typeof update>) => {
    startTransition(async () => {
      const response = await update(...args)

      if (response.success) {
        router.replace(
          addQueryParams(successUri, { update_activity_success: 'true' })
        )
      } else {
        setError(response.message ?? '')
      }
    })
  }

  return {
    create: _create,
    update: _update,
    error,
    isLoading
  }
}
