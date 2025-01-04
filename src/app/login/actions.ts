'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import {
  loginMumtaz,
  loginUsingPinPrep,
  successLoginStudentCallback
} from '@/utils/auth/login-mumtaz'
import { INVALID_CREDENTIALS } from '@/models/copywriting/auth'
import { loginSupabase } from '@/utils/auth/login-supabase'
import { isMumtazLoginNeeded } from '@/utils/is-mumtaz-login-needed'

// FIXME(dio): Allow to override this function.
export async function login(_prevState: unknown, formData: FormData) {
  let redirectUri = ''

  const data = {
    username: formData.get('username') as string,
    password: formData.get('password') as string
  }

  try {
    if (isMumtazLoginNeeded(data.username)) {
      let status = -1,
        mumtazResponse = undefined

      if (!/@santri\./.test(data.username)) {
        // Skip mumtaz login when using test users.
        ;({ status, data: mumtazResponse } = await loginMumtaz({
          username: data.username,
          password: data.password
        }))
      }

      // Logged in using mumtaz.
      if (mumtazResponse) {
        redirectUri = await successLoginStudentCallback(mumtazResponse)
      } else if (status === 401) {
        throw new Error(INVALID_CREDENTIALS)
      } else {
        // Login using PIN
        redirectUri = await loginUsingPinPrep(data.username)
      }
    } else {
      // IF it ends with .mh, we complete the email address.
      const dotNamespace = `.${process.env.NEXT_PUBLIC_APP_NAMESPACE || 'mh'}`
      if (data.username.endsWith(dotNamespace)) {
        data.username = data.username.replace(
          dotNamespace,
          `${dotNamespace}.khutwah.id`
        )
      }

      // Otherwise, login using Supabase for admin, ustadz, and lajnah.
      await loginSupabase({
        email: data.username,
        password: data.password
      })

      redirectUri = '/'
    }
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
