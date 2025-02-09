import {
  FilterPayload,
  UpsertPayload,
  ResetPayload
} from '@/models/assessments'
import { Base } from './base'

const QUERY_FIELDS = `
  id,
  student:students (id, name),
  ustadz:users (id, name),
  surah_range,
  start_date,
  end_date,
  notes,
  low_mistake_count,
  medium_mistake_count,
  high_mistake_count,
  parent_assessment_id,
  final_mark,
  session_type,
  session_range_id,
  session_name,
  start_date,
  assignee
`

export class Assessments extends Base {
  async list(filter: FilterPayload, isFinalized?: boolean) {
    const { parent_assessment_id, ustadz_id, student_id } = filter
    const supabase = await this.supabase
    let query = supabase.from('assessments').select(QUERY_FIELDS)

    if (ustadz_id) {
      query = query.eq('ustadz_id', ustadz_id)
    }

    if (student_id) {
      query = query.eq('student_id', student_id)
    }

    if (parent_assessment_id === null) {
      query = query.is('parent_assessment_id', null)
    }

    if (filter.limit) {
      query = query.limit(filter.limit)
    }

    if (parent_assessment_id) {
      query = query.or(
        `id.eq.${parent_assessment_id},parent_assessment_id.eq.${parent_assessment_id}`
      )
    }

    if (isFinalized) {
      query = query.not('final_mark', 'is', null)
      return query.order('id', { ascending: false })
    } else {
      return query.order('id')
    }
  }

  async reset(payload: ResetPayload) {
    const { parent_assessment_id, offset_parent_assessment_id } = payload
    const supabase = await this.supabase

    const hasCompleted = await supabase
      .from('assessments')
      .select('id')
      .not('final_mark', 'is', null)
      .eq('parent_assessment_id', parent_assessment_id)
      .limit(1)
      .maybeSingle()

    if (hasCompleted.data?.id) {
      throw new Error('lajnah already completed')
    }

    let query = supabase.from('assessments').delete()

    query = query.eq('parent_assessment_id', parent_assessment_id)

    if (offset_parent_assessment_id) {
      query = query.gt('id', offset_parent_assessment_id)
    }

    return query
  }

  async create(payload: UpsertPayload) {
    const supabase = await this.supabase
    return supabase
      .from('assessments')
      .insert(payload)
      .select('id')
      .maybeSingle()
  }

  async get(id: number) {
    const supabase = await this.supabase
    return supabase
      .from('assessments')
      .select(QUERY_FIELDS)
      .eq('id', id)
      .limit(1)
      .maybeSingle()
  }

  async update(id: number, payload: Partial<UpsertPayload>) {
    const supabase = await this.supabase
    return supabase.from('assessments').update(payload).eq('id', id)
  }
}
