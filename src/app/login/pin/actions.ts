'use server'

import { TEMPORARY_PIN_PAGE_ID_COOKIE } from '@/models/auth'
import { INVALID_PIN, MIN_MAX_PIN } from '@/models/copywriting/auth'
import { cookies } from 'next/headers'
import { loginSupabase } from '@/utils/auth/login-supabase'
import { Students } from '@/utils/supabase/models/students'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(_prevState: unknown, formData: FormData) {
  let redirectUri = ''

  const data = {
    pin: formData.get('pin') as string
  }

  try {
    if (data.pin.length !== 6) throw new Error(MIN_MAX_PIN)

    const _cookies = await cookies()
    const email = _cookies.get(TEMPORARY_PIN_PAGE_ID_COOKIE)
    if (!email) throw new Error('Antum semestinya tidak berada di halaman ini')

    const student = new Students()
    const result = await student.list({ pin: data.pin, email: email.value })
    if (!result.data?.length) {
      throw new Error(INVALID_PIN)
    }

    await loginSupabase({
      email: email.value,
      password: process.env.DEFAULT_STUDENT_PASSWORD!
    })

    _cookies.delete(TEMPORARY_PIN_PAGE_ID_COOKIE)
    redirectUri = '/'
  } catch (error) {
    const e = (error as Error).message
    return {
      message: e
    }
  } finally {
    if (redirectUri) {
      revalidatePath(redirectUri, 'layout')
      redirect(redirectUri)
    }
  }
}
