import { Base } from '@/utils/supabase/models/base'
import { Halaqah } from '@/utils/supabase/models/halaqah'
import { getUser } from '@/utils/supabase/get-user'
import { CheckpointStatus } from '@/models/checkpoint'
import { RoleFilter } from '@/models/supabase/models/filter'

interface ListFilter extends RoleFilter {
  virtual_account?: string
  pin?: string
  email?: string
  halaqah_ids?: number[]
  checkpoint_statuses?: CheckpointStatus[]
}

interface CreatePayload {
  parent_id: number
  virtual_account: string
  pin?: string
  name: string
}

const COLUMNS = `id, name, users (id, email), halaqah (id, name)`
export class Students extends Base {
  async list(args: ListFilter) {
    const {
      virtual_account,
      pin,
      email,
      student_id,
      ustadz_id,
      halaqah_ids,
      checkpoint_statuses
    } = args

    let resolvedColumns = COLUMNS

    const hasCheckpointStatusFilter =
      Array.isArray(checkpoint_statuses) && checkpoint_statuses.length > 0

    if (hasCheckpointStatusFilter) {
      resolvedColumns = `${COLUMNS}, last_checkpoint:checkpoint!inner (id, status)`
    }

    let query = (await this.supabase).from('students').select(resolvedColumns)

    if (virtual_account) query = query.eq('virtual_account', virtual_account)
    if (pin) query = query.eq('pin', pin)
    if (email) query = query.eq('users.email', email)
    if (student_id) query = query.eq('parent_id', student_id)

    if (halaqah_ids) query = query.in('halaqah_id', halaqah_ids)

    if (ustadz_id) {
      const halaqahIds = await this.getHalaqahByUstad({
        ustadz_id: ustadz_id,
        halaqahIds: halaqah_ids
      })
      query = query.in('halaqah_id', halaqahIds)
    }

    if (hasCheckpointStatusFilter) {
      query = query
        .order('updated_at', {
          ascending: false,
          referencedTable: 'checkpoint'
        })
        .limit(1, { foreignTable: 'checkpoint' })
        .in('checkpoint.status', checkpoint_statuses)
    }

    const result = await query

    return result
  }

  async isPinSubmitted(virtual_account: string) {
    const query = (await this.supabase)
      .from('students')
      .select('id')
      .eq('virtual_account', virtual_account)
      .not('pin', 'is', null)
      .limit(1)

    const response = await query.single()
    return Boolean(response.data)
  }

  async getHalaqahByUstad({
    ustadz_id,
    halaqahIds
  }: {
    ustadz_id: number
    halaqahIds?: number[]
  }) {
    const halaqah = new Halaqah()
    const response = await halaqah.list({
      ustadz_id: ustadz_id
    })
    const assignedHalaqah = response?.data?.map((item) => item.id) ?? []

    const _halaqahIds = halaqahIds?.length
      ? halaqahIds.filter((id) => assignedHalaqah.includes(id))
      : assignedHalaqah

    return _halaqahIds
  }

  async get(id: number, roleFilter?: RoleFilter) {
    let query = (await this.supabase)
      .from('students')
      .select(COLUMNS)
      .eq('id', id)

    if (roleFilter?.student_id) {
      query = query.eq('users.id', roleFilter?.student_id)
    } else if (roleFilter?.ustadz_id) {
      const halaqahIds = await this.getHalaqahByUstad({
        ustadz_id: roleFilter?.ustadz_id
      })
      query = query.in('halaqah_id', halaqahIds)
    }

    const response = await query.limit(1).single()

    const data = response?.data?.users ? response.data : null

    return {
      ...response,
      data
    }
  }

  async getByParentId(id: number) {
    const query = (await this.supabase)
      .from('students')
      .select(COLUMNS)
      .eq('parent_id', id)

    const response = await query.limit(1).single()

    const data = response?.data?.users ? response.data : null

    return {
      ...response,
      data
    }
  }

  async isUserManagesStudent(id: number) {
    const halaqahIds = await this.getHalaqahByUstad({
      ustadz_id: (await getUser()).data?.id ?? 0
    })

    const query = await (await this.supabase)
      .from('students')
      .select('id')
      .eq('id', id)
      .in('halaqah_id', halaqahIds)
      .limit(1)
      .maybeSingle()

    return Boolean(query.data)
  }

  async create(payload: CreatePayload) {
    return (await this.supabase).from('students').insert(payload)
  }

  async update(userId: number, payload: Partial<CreatePayload>) {
    return (await this.supabase)
      .from('students')
      .update(payload)
      .eq('parent_id', userId)
  }
}
