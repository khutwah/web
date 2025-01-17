import { createClient } from '../supabase/server'
import { cookies } from 'next/headers'

export async function logoutSupabase() {
  const supabase = await createClient()

  const { error: errorSignout } = await supabase.auth.signOut()
  if (errorSignout) {
    throw errorSignout
  }

  const store = await cookies()
  store.delete('role')

  return true
}
