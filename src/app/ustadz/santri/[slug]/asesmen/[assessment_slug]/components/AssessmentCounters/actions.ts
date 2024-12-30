'use server'

import { UpsertPayload } from '@/models/assessments'
import { Assessments } from '@/utils/supabase/models/assessments'

interface Payload {
  id: string
  low_mistake_count: string
  medium_mistake_count: string
  high_mistake_count: string
}

export type UpsertPayloadMistakeCounts = Pick<
  UpsertPayload,
  'low_mistake_count' | 'medium_mistake_count' | 'high_mistake_count'
>

export type UpdateAssessmentMistakeCountersState = {
  message?: string
  lastUpdate?: string
  isInitialLoad?: boolean
}

export async function updateAssessmentMistakeCounters(
  _prevState: unknown,
  formData: FormData
): Promise<UpdateAssessmentMistakeCountersState> {
  const { id, ...entries } = Object.fromEntries(formData) as unknown as Payload

  const assessmentsInstance = new Assessments()

  try {
    const mistakesCount = convertObjectValuesToNumbers(
      entries
    ) satisfies UpsertPayloadMistakeCounts

    await assessmentsInstance.update(Number(id), {
      ...mistakesCount,
      updated_at: new Date().toISOString()
    })

    return {
      lastUpdate: new Date().toISOString()
    }
  } catch (error) {
    const e = (error as Error).message
    return {
      message: e
    }
  }
}

function convertObjectValuesToNumbers<T extends Record<string, string>>(
  obj: T
): Record<keyof T, number> {
  const newObj: Record<string, number> = {}
  for (const key in obj) {
    const converted = Number(obj[key])
    if (isNaN(converted)) continue

    newObj[key] = converted
  }

  return newObj as Record<keyof T, number>
}
