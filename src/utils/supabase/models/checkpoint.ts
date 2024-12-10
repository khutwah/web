import { Filter, InsertPayload, UpdatePayload } from '@/models/checkpoint'
import { Base } from './base'

const SELECTED = `
    status,
    start_date,
    end_date,
    page_count_accumulation,
    part_count,
    notes
`

export class Checkpoint extends Base {
  async list(filter: Filter) {
    let query = (await this.supabase).from('checkpoint').select(SELECTED)

    if (filter.student_id) {
      query = query.eq('student_id', filter.student_id)
    }

    if (filter.status) {
      query = query.eq('status', filter.status)
    }

    if (filter.start_date) {
      query = query.gte('start_date', filter.start_date)
    }

    if (filter.end_date === null) {
      query = query.is('end_date', null)
    }

    if (filter.end_date) {
      query = query.not('end_date', 'is', null).lte('end_date', filter.end_date)
    }

    if (filter.limit) {
      query = query.limit(filter.limit)
    }

    return query
  }

  async get(id: number) {
    return (await this.supabase)
      .from('checkpoint')
      .select(SELECTED)
      .eq('id', id)
      .limit(1)
      .maybeSingle()
  }

  async create(payload: InsertPayload) {
    const supabase = await this.supabase
    return supabase.from('checkpoint').insert(payload)
  }

  async update(id: number, payload: UpdatePayload) {
    const supabase = await this.supabase
    return supabase.from('checkpoint').update(payload).eq('id', id)
  }
}
