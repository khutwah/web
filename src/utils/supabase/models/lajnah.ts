import { InsertPayload } from '@/models/lajnah'
import { Base } from './base'

export class Lajnah extends Base {
  async create(payload: InsertPayload) {
    const supabase = await this.supabase
    return supabase.from('lajnah').insert(payload)
  }
}
