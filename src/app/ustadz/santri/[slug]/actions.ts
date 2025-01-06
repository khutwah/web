'use server'

import { ROLE } from '@/models/auth'
import { MENU_USTADZ_PATH_RECORDS } from '@/utils/menus/ustadz'
import { assessmentSchema } from '@/utils/schemas/assessments'
import { getUser } from '@/utils/supabase/get-user'
import { getUserRole } from '@/utils/supabase/get-user-role'
import { Assessments } from '@/utils/supabase/models/assessments'
import { validateOrFail } from '@/utils/validate-or-fail'
import { redirect } from 'next/navigation'
import { InferType } from 'yup'

type CreateSchema = InferType<typeof assessmentSchema>
type AssessmentPayload = Omit<CreateSchema, 'status_checkpoint_id'>

type AssessmentReturn = {
  assessmentPayload: AssessmentPayload
  status_checkpoint_id?: number
}

export async function createAssessment(_prev: unknown, formData: FormData) {
  let redirectUri = ''
  const payload = await validateOrFail<CreateSchema>(() =>
    assessmentSchema.validate(Object.fromEntries(formData), {
      stripUnknown: true
    })
  )

  if ('message' in payload) {
    return {
      message: payload.message
    }
  }

  const { assessmentPayload, status_checkpoint_id } =
    destructurePayloads(payload)

  const user = await getUser()
  const data = { ...assessmentPayload, ustadz_id: user.id }

  const surahRangeForCheckpoint = JSON.parse(data.surah_range)
  const newArray = [[surahRangeForCheckpoint[0][0]]]

  const assessmentsInstance = new Assessments()
  try {
    const result = await assessmentsInstance.prisma.$transaction(async (tx) => {
      const parent = await tx.assessments.create({
        data: {
          ...data,
          surah_range: JSON.parse(data.surah_range)
        }
      })

      const createdAssessment = await tx.assessments.create({
        data: {
          ustadz_id: data.ustadz_id,
          student_id: data.student_id,
          start_date: new Date().toISOString(),
          surah_range: newArray,
          parent_assessment_id: parent.id
        }
      })

      const role = await getUserRole()
      const status =
        role === ROLE.LAJNAH
          ? 'lajnah-assessment-ongoing'
          : 'assessment-ongoing'

      // When we have a status_checkpoint_id, we update the status of the checkpoint.
      if (status_checkpoint_id) {
        await tx.checkpoints.update({
          where: {
            id: status_checkpoint_id
          },
          data: { status }
        })
      } else {
        await tx.checkpoints.create({
          data: {
            student_id: data.student_id,
            start_date: new Date().toISOString(),
            status,
            assessment_id: createdAssessment.id
          }
        })
      }

      return { parent }
    })

    redirectUri = `${MENU_USTADZ_PATH_RECORDS.santri}/${data.student_id}/asesmen/${result.parent.id}`
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
  const { status_checkpoint_id, ...assessmentPayload } = payload
  return {
    assessmentPayload,
    status_checkpoint_id
  }
}
