import { Base } from './base'

export class Tags extends Base {
  async list() {
    return await (await this.supabase).from('tags').select(`name, type`)
  }
}
