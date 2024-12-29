import { Base } from './base'

export class Tags extends Base {
  async list() {
    return (await this.supabase).from('tags').select(`name, category`)
  }
}
