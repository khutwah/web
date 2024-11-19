'use server'

import { MIN_MAX_PIN } from '@/models/copywriting/auth'
import { Auth } from '@/utils/supabase/models/auth'
import { Students } from '@/utils/supabase/models/students'
import { User } from '@/utils/supabase/models/user'
import { redirect } from 'next/navigation'

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
      throw new Error('Gagal memberikan pin')
    }
    isRedirect = true
  } catch (error) {
    return {
      message: (error as Error).message
    }
  } finally {
    if (isRedirect) redirect('/')
  }
}
