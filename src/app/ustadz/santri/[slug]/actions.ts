'use server'

import { lajnahSchema } from '@/utils/schemas/lajnah'
import { getUser } from '@/utils/supabase/get-user'
import { Lajnah } from '@/utils/supabase/models/lajnah'
import { validateOrFail } from '@/utils/validate-or-fail'
import { redirect } from 'next/navigation'
import { InferType } from 'yup'

type CreateSchema = InferType<typeof lajnahSchema>

export async function createLajnah(_prev: unknown, formData: FormData) {
  let redirectUri = ''
  const payload = await validateOrFail<CreateSchema>(() =>
    lajnahSchema.validate({
      session_name: formData.get('session_name'),
      session_type: formData.get('session_type'),
      student_id: formData.get('student_id'),
      start_surah: formData.get('start_surah'),
      start_verse: formData.get('start_verse'),
      end_surah: formData.get('end_surah'),
      end_verse: formData.get('end_verse'),
      start_date: formData.get('start_date')
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

  const lajnahInstance = new Lajnah()
  try {
    const result = await lajnahInstance.create(data)
    if (result.error) {
      return {
        message: result.error.message
      }
    }

    redirectUri = `/ustadz/lajnah/${result.data?.id}`
  } catch (error) {
    console.error(error)
    return {
      message: 'Maaf, ada kesalahan sistem, coba lagi nanti.'
    }
  } finally {
    if (redirectUri) redirect(redirectUri)
  }
}
