'use server'

import { assessmentSchema } from '@/utils/schemas/assessments'
import { getUser } from '@/utils/supabase/get-user'
import { Assessments } from '@/utils/supabase/models/assessments'
import { validateOrFail } from '@/utils/validate-or-fail'
import { redirect } from 'next/navigation'
import { InferType } from 'yup'

type CreateSchema = InferType<typeof assessmentSchema>

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

  const user = await getUser()

  if (!user.data) {
    return {
      message: 'Maaf, anda tidak punya akses, silakan login kembali'
    }
  }

  const data = { ...payload, ustadz_id: user.data.id }

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

    redirectUri = `/ustadz/asesmen/${result.data?.id}`
  } catch (error) {
    console.error(error)
    return {
      message: 'Maaf, ada kesalahan sistem, coba lagi nanti.'
    }
  } finally {
    if (redirectUri) redirect(redirectUri)
  }
}
