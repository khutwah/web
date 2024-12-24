import { FilterPayload, UpsertPayload, ResetPayload } from '@/models/lajnah'
import { Base } from './base'

export class Lajnah extends Base {
  async list(filter: FilterPayload) {
    const { parent_lajnah_id, ustadz_id, student_id } = filter
    const supabase = await this.supabase
    let query = supabase.from('lajnah').select(`
            students(id, name),
            ustadz:users(id, name),
            start_surah,
            start_verse,
            end_surah,
            end_verse,
            start_date,
            end_date,
            notes,
            low_mistake_count,
            medium_mistake_count,
            high_mistake_count,
            final_mark,
            session_type,
            session_name
        `)

    if (ustadz_id) {
      query = query.eq('ustadz_id', ustadz_id)
    }

    if (student_id) {
      query = query.eq('student_id', student_id)
    }

    if (parent_lajnah_id === null) {
      query = query.is('parent_lajnah_id', null)
    }

    if (parent_lajnah_id) {
      query = query.or(
        `id.eq.${parent_lajnah_id},parent_lajnah_id.eq.${parent_lajnah_id}`
      )
    }

    return query
  }

  async reset(payload: ResetPayload) {
    const { parent_lajnah_id, offset_parent_lajnah_id } = payload
    const supabase = await this.supabase

    const hasCompleted = await supabase
      .from('lajnah')
      .select('id')
      .not('final_mark', 'is', null)
      .eq('parent_lajnah_id', parent_lajnah_id)
      .limit(1)
      .maybeSingle()

    if (hasCompleted.data?.id) {
      throw new Error('lajnah already completed')
    }

    let query = supabase.from('lajnah').delete()

    query = query.eq('parent_lajnah_id', parent_lajnah_id)

    if (offset_parent_lajnah_id) {
      query = query.gt('id', offset_parent_lajnah_id)
    }

    return query
  }

  async create(payload: UpsertPayload) {
    const supabase = await this.supabase
    return supabase.from('lajnah').insert(payload)
  }

  async update(id: number, payload: UpsertPayload) {
    const supabase = await this.supabase
    return supabase.from('lajnah').update(payload).eq('id', id)
  }
}
