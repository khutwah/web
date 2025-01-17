import { loginSupabaseArgs } from '@/models/login-supabase'
import { createClient } from '../supabase/server'
import { cookies } from 'next/headers'
import { User } from '@/utils/supabase/models/user'

export async function loginSupabase(args: loginSupabaseArgs) {
  const supabase = await createClient()

  const { error: errorSignin } = await supabase.auth.signInWithPassword({
    email: args.email,
    password: args.password
  })
  if (errorSignin) {
    throw errorSignin
  }

  const user = new User()
  const _user = await user.get({
    email: args.email
  })
  const role = _user.data?.role ?? -1

  const store = await cookies()
  store.set('role', role.toString(), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax'
  })

  return true
}
