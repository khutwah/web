import { Filter, InsertPayload, UpdatePayload } from '@/models/checkpoints'
import { Base } from './base'

const SELECTED = `
    id,
    status,
    start_date,
    end_date,
    page_count_accumulation,
    part_count,
    notes
`

export class Checkpoint extends Base {
  async list(filter?: Filter) {
    const now = new Date().toISOString()

    let query = (await this.supabase)
      .from('checkpoints')
      .select(SELECTED)
      .lt('start_date', now)
      .or(`end_date.is.null,end_date.gt.${now}`)

    if (filter?.student_id) {
      query = query.eq('student_id', filter?.student_id)
    }

    if (filter?.status) {
      query = query.in('status', filter?.status)
    }

    if (filter?.limit) {
      query = query.limit(filter?.limit)
    }

    return query
  }

  async get(id: number) {
    return (await this.supabase)
      .from('checkpoints')
      .select(SELECTED)
      .eq('id', id)
      .limit(1)
      .maybeSingle()
  }

  async create(payload: InsertPayload) {
    const supabase = await this.supabase
    return supabase.from('checkpoints').insert(payload)
  }

  async update(id: number, payload: UpdatePayload) {
    const supabase = await this.supabase
    return supabase.from('checkpoints').update(payload).eq('id', id)
  }
}
