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
  UpdateAssessmentMistakeCountersState,
  UpsertPayloadMistakeCounts
} from './actions'
import {
  MistakeCounter,
  MistakeCounterProps
} from '@/components/Assesment/MistakeCounter'
import { useErrorToast } from '@/hooks/useToast'
import { Assessments } from '@/utils/supabase/models/assessments'
import { MistakeCounterType } from '@/models/assessments'
import { useRouter } from 'next/navigation'

interface Props {
  assessment: NonNullable<
    Awaited<ReturnType<Assessments['list']>>['data']
  >[number]
}

const INITIAL_ASSESSMENT_ID = -1

export function AssessmentCounters({ assessment }: Props) {
  const [state, formAction, isPending] = useActionState<
    UpdateAssessmentMistakeCountersState,
    FormData
  >(updateAssessmentMistakeCounters, { isInitialLoad: true })

  const [mistakesCount, setMistakesCount] = useState<MistakeCounterType>({
    low: assessment.low_mistake_count ?? 0,
    medium: assessment.medium_mistake_count ?? 0,
    high: assessment.high_mistake_count ?? 0
  })

  const router = useRouter()
  const timeoutRef = useRef<NodeJS.Timeout>()
  const prevAssessmentId = useRef<number>(INITIAL_ASSESSMENT_ID)

  useErrorToast(state?.message, isPending)
  useEffect(() => {
    const shouldSkipUpdate = Object.values(mistakesCount).every(
      (value) => value === 0
    )

    // Prevent updating if all numbers are 0, or if it's the initial assessment.
    if (
      prevAssessmentId.current === INITIAL_ASSESSMENT_ID ||
      shouldSkipUpdate
    ) {
      return
    }

    // Do batch updates for the mistakes count.
    clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      const formData = new FormData()

      formData.set('id', String(assessment.id))
      for (const key in mistakesCount) {
        const typedKey = key as keyof typeof mistakesCount
        formData.set(
          getAssessmentCounterFieldName(typedKey),
          String(mistakesCount[typedKey])
        )
      }

      startTransition(() => {
        formAction(formData)
      })
    }, 500)

    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [assessment.id, mistakesCount, formAction])

  useEffect(() => {
    // `lastUpdate` indicates successful update. So it covers 3 events:
    //
    // 1. Initial state --> success
    // 2. Error state --> success
    // 3. Success --> success
    if (!state?.lastUpdate) return

    router.refresh()
  }, [state?.lastUpdate, router])

  useEffect(() => {
    // Reset mistakes count when assessment ID differs. This is used after we create a new checkpoint.
    // If we don't do this, then the `assessment` will refer to the initially rendered one (from SSR).
    //
    // This will also make sure that there will be no race condition between the optimistic updates and the `router.refresh()`.
    if (prevAssessmentId.current === assessment.id) return

    if (prevAssessmentId.current !== INITIAL_ASSESSMENT_ID) {
      setMistakesCount({
        low: assessment.low_mistake_count ?? 0,
        medium: assessment.medium_mistake_count ?? 0,
        high: assessment.high_mistake_count ?? 0
      })
    }

    prevAssessmentId.current = assessment.id
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
        type='low'
        count={mistakesCount.low}
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
        type='high'
        count={mistakesCount.high}
        onChange={onChange}
      />
    </div>
  )
}

function getAssessmentCounterFieldName(
  type: keyof MistakeCounterType
): keyof UpsertPayloadMistakeCounts {
  if (type === 'low') return 'low_mistake_count'
  if (type === 'medium') return 'medium_mistake_count'

  return 'high_mistake_count'
}
