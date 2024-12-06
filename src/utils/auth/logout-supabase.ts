import { createClient } from '../supabase/server'

export async function logoutSupabase() {
  const supabase = await createClient()

  const { error: errorSignout } = await supabase.auth.signOut()
  if (errorSignout) throw errorSignout

  return true
}
