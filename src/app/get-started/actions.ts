'use server'

import { MIN_MAX_PIN } from '@/models/copywriting/auth'
import { Auth } from '@/utils/supabase/models/auth'
import { Students } from '@/utils/supabase/models/students'
import { User } from '@/utils/supabase/models/user'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { PIN_IS_SUBMMITTED } from '@/models/auth'

export async function action(_prev: unknown, formData: FormData) {
  let isRedirect = false
  try {
    const pin = formData.get('pin') as string

    if (pin.length < 6 || pin.length > 6) throw new Error(MIN_MAX_PIN)

    const auth = new Auth()
    const authId = (await auth.get())?.id ?? ''

    const user = new User()
    const response = await user.get({ sb_user_id: authId })
    const userId = response.data?.id

    const student = new Students()
    const update = await student.update(userId ?? -1, { pin: pin })
    if (update.error) {
      throw new Error('Penyimpanan PIN belum berhasil. Silakan coba lagi.')
    }

    revalidatePath('/', 'layout')
    isRedirect = true

    const cookie = await cookies()
    cookie.delete(PIN_IS_SUBMMITTED)

    return {
      success: true
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return {
      message: errorMessage,
      success: false
    }
  } finally {
    if (isRedirect) {
      redirect('/')
    }
  }
}
