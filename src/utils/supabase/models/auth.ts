import { Base } from './base'

export class Auth extends Base {
  async get() {
    const result = await (await this.supabase).auth.getUser()
    if (result.error) throw new Error(result.error.message)
    return result.data.user
  }
}
