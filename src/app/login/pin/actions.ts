'use server'

import { TEMPORARY_PIN_PAGE_ID_COOKIE } from '@/models/auth'
import { INVALID_PIN, MIN_MAX_PIN } from '@/models/copywriting/auth'
import { loginSupabase } from '@/utils/auth/login-supabase'
import { Students } from '@/utils/supabase/models/students'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(_prevState: any, formData: FormData) {
  let isRedirect = false
  try {
    const pin = formData.get('pin') as string
    if (pin.length < 6 || pin.length > 6) throw new Error(MIN_MAX_PIN)

    const _cookies = await cookies()
    const email = _cookies.get(TEMPORARY_PIN_PAGE_ID_COOKIE)
    if (!email) throw new Error('you are not suppose to be here')

    const student = new Students()
    const result = await student.list({ pin, email: email.value })
    if (!result.data?.length) {
      throw new Error(INVALID_PIN)
    }

    await loginSupabase({
      email: email.value,
      password: process.env.DEFAULT_STUDENT_PASSWORD!
    })

    _cookies.delete(TEMPORARY_PIN_PAGE_ID_COOKIE)
    isRedirect = true
  } catch (error) {
    const e = error instanceof Error ? error.message : String(error)
    return {
      message: e
    }
  } finally {
    if (isRedirect) {
      revalidatePath('/', 'layout')
      redirect('/')
    }
  }
}
