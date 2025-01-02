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
    process.env.SUPABASE_API_URL!,
    process.env.SUPABASE_ANON_KEY!,
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
