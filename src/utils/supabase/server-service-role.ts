import 'server-only'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/models/database.types'

export async function createServerServiceRoleClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    }
  )
}
