import { Base } from './base'

interface UserPayload {
  email: string
  name: string
  last_logged_in?: string
  role: number
  sb_user_id: string
}

interface GetFilter {
  email?: string
  sb_user_id?: number
}

export class User extends Base {
  async create(payload: UserPayload) {
    return (await this.supabase).from('users').upsert(payload).select()
  }

  async get({ email, sb_user_id }: GetFilter) {
    const query = (await this.supabase).from('users').select()

    if (email) query.eq('email', email)
    if (sb_user_id) query.eq('sb_user_id', sb_user_id)

    const result = await query.limit(1).single()

    return result
  }
}
