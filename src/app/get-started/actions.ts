'use server'

import { MIN_MAX_PIN } from '@/models/copywriting/auth'
import { Auth } from '@/utils/supabase/models/auth'
import { Students } from '@/utils/supabase/models/students'
import { User } from '@/utils/supabase/models/user'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { PIN_IS_SUBMMITTED } from '@/models/auth'

export async function validatePin(_prev: unknown, formData: FormData) {
  let redirectUri = ''

  const data = {
    pin: formData.get('pin') as string
  }

  try {
    if (data.pin.length !== 6) throw new Error(MIN_MAX_PIN)

    const auth = new Auth()
    const authId = (await auth.get())?.id ?? ''

    const user = new User()
    const response = await user.get({ sb_user_id: authId })
    const userId = response.data?.id

    const studentsInstance = new Students()
    const update = await studentsInstance.updateByParentId(userId ?? -1, {
      pin: data.pin
    })
    if (update.error) {
      throw new Error('Penyimpanan PIN belum berhasil. Silakan coba lagi.')
    }

    const _cookies = await cookies()
    _cookies.delete(PIN_IS_SUBMMITTED)
    redirectUri = '/'
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return {
      message: errorMessage,
      success: false
    }
  } finally {
    if (redirectUri) {
      revalidatePath(redirectUri, 'layout')
      redirect(redirectUri)
    }
  }
}
