import { createServerClient } from '@supabase/ssr'

export default class Supabase {
  constructor() {
    this.client = createClient()
  }

  async registerUser(displayName: string, email: string, password: string) {
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: {
        data: { displayName }
      }
    })
    if (error) {
      throw error
    }
    return data
  }

  client: ReturnType<typeof createClient>
}

function createClient() {
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
