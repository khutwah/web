'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { logoutSupabase } from '@/utils/auth/logout-supabase'

export async function logout() {
  let redirectUri = ''

  try {
    await logoutSupabase()

    redirectUri = '/login'
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
