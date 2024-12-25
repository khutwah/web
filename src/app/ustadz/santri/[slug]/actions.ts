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
    lajnahSchema.validate(Object.fromEntries(formData), { stripUnknown: true })
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
    // create parent / master lajnah
    const result = await lajnahInstance.create(data)
    if (result.error) {
      return {
        message: result.error.message
      }
    }

    // create 1st draft checkpoint
    await lajnahInstance.create({
      ustadz_id: data.ustadz_id,
      student_id: data.student_id,
      start_date: new Date().toISOString(),
      surah_range: data.surah_range,
      parent_lajnah_id: result.data?.id
    })

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
