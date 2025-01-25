'use server'

import { validateOrFail } from '@/utils/validate-or-fail'
import { UpdatePasswordSchema } from '@/models/password'
import { createClient } from '@/utils/supabase/server'
import { getUser } from '@/utils/supabase/get-user'
import { MENU_USTADZ_PATH_RECORDS } from '@/utils/menus/ustadz'
import { redirect } from 'next/navigation'

export async function updatePassword(_prevState: unknown, formData: FormData) {
  const payload = await validateOrFail(() =>
    UpdatePasswordSchema.validate(Object.fromEntries(formData), {
      stripUnknown: true
    })
  )

  if ('message' in payload) {
    return {
      message: payload.message
    }
  }

  const { old_password, new_password, confirm_password } = payload

  if (new_password !== confirm_password) {
    return {
      message: 'Sandi baru dan konfirmasi sandi baru tidak sama.'
    }
  }

  let redirectUri = ''

  try {
    const user = await getUser()
    const supabase = await createClient()
    const { error: errorSignin } = await supabase.auth.signInWithPassword({
      email: user?.email,
      password: old_password
    })

    if (errorSignin) {
      return {
        message: 'Sandi saat ini kurang pas.'
      }
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: new_password
    })

    if (updateError) {
      return {
        message: `Gagal mengganti sandi. Coba lagi nanti. ${updateError}.`
      }
    }

    redirectUri = MENU_USTADZ_PATH_RECORDS.settings
  } catch (error) {
    const e = (error as Error).message
    return {
      message: e
    }
  } finally {
    if (redirectUri) {
      redirect(redirectUri)
    }
  }
}
