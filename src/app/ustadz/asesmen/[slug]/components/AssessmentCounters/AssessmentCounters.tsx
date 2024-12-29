'use client'

import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState
} from 'react'
import {
  updateAssessmentMistakeCounters,
  UpsertPayloadMistakeCounts
} from './actions'
import {
  MistakeCounter,
  MistakeCounterProps
} from '@/components/Lajnah/MistakeCounter'
import { useErrorToast } from '@/hooks/useToast'
import { Assessments } from '@/utils/supabase/models/assessments'
import { MistakeCounterType } from '@/models/assessments'
import { useRouter } from 'next/navigation'

interface Props {
  assessment: NonNullable<
    Awaited<ReturnType<Assessments['list']>>['data']
  >[number]
}

export function AssessmentCounters({ assessment }: Props) {
  const [state, formAction, isPending] = useActionState(
    updateAssessmentMistakeCounters,
    {
      message: ''
    }
  )
  const [mistakesCount, setMistakesCount] = useState<MistakeCounterType>({
    small: assessment.low_mistake_count ?? 0,
    medium: assessment.medium_mistake_count ?? 0,
    large: assessment.high_mistake_count ?? 0
  })

  const router = useRouter()
  const timeoutRef = useRef<NodeJS.Timeout>()

  useErrorToast(state?.message, isPending)
  useEffect(() => {
    // Do batch updates for the mistakes count.
    clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      const formData = new FormData()

      formData.set('id', String(assessment.id))
      formData.set(
        getAssessmentCounterFieldName('small'),
        String(mistakesCount.small)
      )
      formData.set(
        getAssessmentCounterFieldName('medium'),
        String(mistakesCount.medium)
      )
      formData.set(
        getAssessmentCounterFieldName('large'),
        String(mistakesCount.large)
      )

      startTransition(() => {
        formAction(formData)
        router.refresh()
      })
    }, 500)

    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [assessment.id, mistakesCount, formAction, router])

  useEffect(() => {
    // Reset mistakes count when assessment object differs.
    setMistakesCount({
      small: assessment.low_mistake_count ?? 0,
      medium: assessment.medium_mistake_count ?? 0,
      large: assessment.high_mistake_count ?? 0
    })
  }, [
    assessment.id,
    assessment.low_mistake_count,
    assessment.medium_mistake_count,
    assessment.high_mistake_count
  ])

  const onChange: MistakeCounterProps['onChange'] = (type, value) => {
    setMistakesCount((prev) => ({ ...prev, [type]: value }))
  }

  return (
    <div className='flex justify-between gap-x-6'>
      <MistakeCounter
        label='Kecil'
        type='small'
        count={mistakesCount.small}
        onChange={onChange}
      />

      <MistakeCounter
        label='Sedang'
        type='medium'
        count={mistakesCount.medium}
        onChange={onChange}
      />

      <MistakeCounter
        label='Besar'
        type='large'
        count={mistakesCount.large}
        onChange={onChange}
      />
    </div>
  )
}

function getAssessmentCounterFieldName(
  type: keyof MistakeCounterType
): keyof UpsertPayloadMistakeCounts {
  if (type === 'small') return 'low_mistake_count'
  if (type === 'medium') return 'medium_mistake_count'

  return 'high_mistake_count'
}
