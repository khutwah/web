import { createServerClient } from '@supabase/ssr'

function createSupabase() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return null
        },
        setAll() {}
      }
    }
  )
}

export const supabase = createSupabase()
