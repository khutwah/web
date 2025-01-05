'use server'

import { CheckpointStatus } from '@/models/checkpoints'
import { MENU_USTADZ_PATH_RECORDS } from '@/utils/menus/ustadz'
import { assessmentSchema } from '@/utils/schemas/assessments'
import { getUser } from '@/utils/supabase/get-user'
import { Assessments } from '@/utils/supabase/models/assessments'
import { validateOrFail } from '@/utils/validate-or-fail'
import { redirect } from 'next/navigation'
import { InferType, Schema } from 'yup'

type CreateSchema = InferType<typeof assessmentSchema>
type AssessmentPayload = Omit<
  CreateSchema,
  | 'checkpoint_id'
  | 'checkpoint_last_activity_id'
  | 'checkpoint_page_count_accumulation'
  | 'checkpoint_status'
  | 'checkpoint_part_count'
  | 'is_lajnah_assessment'
>

type AssessmentCheckpoint = {
  id?: number
  last_activity_id?: number
  status?: CheckpointStatus
  page_count_accumulation?: number
  part_count?: number
}

type AssessmentReturn = {
  assessmentPayload: AssessmentPayload
  checkpoint: AssessmentCheckpoint
  is_lajnah_assessment: boolean
}

export async function createAssessment(_prev: unknown, formData: FormData) {
  let redirectUri = ''
  console.log(formData)
  let payload = await validateOrFail<CreateSchema>(() =>
    assessmentSchema.validate(Object.fromEntries(formData), {
      stripUnknown: true
    })
  )

  if ('message' in payload) {
    return {
      message: payload.message
    }
  }

  const { assessmentPayload, checkpoint, is_lajnah_assessment } =
    destructurePayloads(payload)

  const user = await getUser()
  const data = { ...assessmentPayload, ustadz_id: user.id }

  const assessmentsInstance = new Assessments()
  try {
    // create parent / master lajnah
    const result = await assessmentsInstance.create({
      ...data,
      surah_range: JSON.parse(data.surah_range)
    })
    if (result.error) {
      return {
        message: result.error.message
      }
    }

    const surahRangeForCheckpoint = JSON.parse(data.surah_range)
    const newArray = [[surahRangeForCheckpoint[0][0]]]

    // create 1st draft checkpoint
    await assessmentsInstance.create({
      ustadz_id: data.ustadz_id,
      student_id: data.student_id,
      start_date: new Date().toISOString(),
      surah_range: newArray,
      parent_assessment_id: result.data?.id
    })

    redirectUri = `${MENU_USTADZ_PATH_RECORDS.santri}/${data.student_id}/asesmen/${result.data?.id}`
  } catch (error) {
    console.error(error)
    return {
      message: 'Maaf, ada kesalahan sistem, coba lagi nanti.'
    }
  } finally {
    if (redirectUri) redirect(redirectUri)
  }
}

function destructurePayloads(payload: CreateSchema): AssessmentReturn {
  const {
    checkpoint_id,
    checkpoint_last_activity_id,
    checkpoint_page_count_accumulation,
    checkpoint_status,
    checkpoint_part_count,
    is_lajnah_assessment,
    ...assessmentPayload
  } = payload
  return {
    assessmentPayload,
    checkpoint: {
      id: checkpoint_id,
      last_activity_id: checkpoint_last_activity_id,
      page_count_accumulation: checkpoint_page_count_accumulation,
      status: checkpoint_status,
      part_count: checkpoint_part_count
    },
    is_lajnah_assessment: is_lajnah_assessment || false
  }
}
