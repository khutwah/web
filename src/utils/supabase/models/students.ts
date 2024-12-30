import { CheckpointStatus } from '@/models/checkpoints'
import { RoleFilter } from '@/models/supabase/models/filter'
import { Base } from '@/utils/supabase/models/base'
import { Circles } from '@/utils/supabase/models/circles'
import { getUser } from '@/utils/supabase/get-user'

interface ListFilter extends RoleFilter {
  virtual_account?: string
  pin?: string
  email?: string
  circle_ids?: number[]
}

interface CreatePayload {
  parent_id: number
  virtual_account: string
  pin?: string
  name: string
}

const COLUMNS = `id, name, users (id, email), circles (id, name)`
export class Students extends Base {
  async list(args: ListFilter) {
    const { virtual_account, pin, email, student_id, ustadz_id, circle_ids } =
      args

    let query = (await this.supabase).from('students').select(COLUMNS)

    if (virtual_account) query = query.eq('virtual_account', virtual_account)
    if (pin) query = query.eq('pin', pin)
    if (email) query = query.eq('users.email', email)
    if (student_id) query = query.eq('parent_id', student_id)

    if (Array.isArray(circle_ids) && circle_ids.length > 0)
      query = query.in('circle_id', circle_ids)

    if (ustadz_id) {
      const circleIds = await this.getCircleByUstadz({
        ustadz_id: ustadz_id,
        circleIds: circle_ids
      })
      query = query.in('circle_id', circleIds)
    }

    const result = await query
    return result
  }

  async listWithoutCheckpoints() {
    const query = (await this.supabase)
      .from('students')
      .select(
        `id, name, circles (id, name), last_checkpoint:checkpoints (id, status)`
      )
      .order('id', {
        ascending: false,
        referencedTable: 'checkpoints'
      })
      // Make sure last checkpoint already ended
      .or(`end_date.lte.${new Date().toLocaleString()}`, {
        referencedTable: 'checkpoints'
      })
      .limit(1, { foreignTable: 'checkpoints' })

    return query
  }

  async listWithCheckpoints(args: {
    checkpoint_statuses?: Array<CheckpointStatus>
    ustadz_id?: number
  }) {
    const { checkpoint_statuses, ustadz_id } = args

    const now = new Date().toISOString()
    const query = (await this.supabase)
      .from('students')
      .select(
        `id, name, circles (id, name), last_checkpoint:checkpoints (id, status)`
      )
      .order('updated_at', {
        ascending: false,
        referencedTable: 'checkpoints'
      })
      // Make sure last checkpoint still active
      // by checking start date < now
      // and end_date > now
      // or end_date null still considered checkpoint active / not ended
      .lt('last_checkpoint.start_date', now)
      .or(`end_date.gt.${new Date().toLocaleString()},end_date.is.null`, {
        referencedTable: 'checkpoints'
      })
      .limit(1, { foreignTable: 'checkpoints' })

    if (ustadz_id) {
      const halaqahIds = await this.getCircleByUstadz({
        ustadz_id: ustadz_id
      })
      query.in('circle_id', halaqahIds)
    }

    if (Array.isArray(checkpoint_statuses) && checkpoint_statuses.length > 0) {
      const resultWithCheckpoints = await query.in(
        'checkpoints.status',
        checkpoint_statuses
      )

      // Only return the student that have checkpoints.
      const data = resultWithCheckpoints.data?.filter(
        (item) => item.last_checkpoint.length > 0
      )
      return { ...resultWithCheckpoints, data }
    }

    return query
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

  async getCircleByUstadz({
    ustadz_id,
    circleIds
  }: {
    ustadz_id: number
    circleIds?: number[]
  }) {
    const circles = new Circles()
    const response = await circles.list({
      ustadz_id: ustadz_id
    })
    const assignedHalaqah = response?.data?.map((item) => item.id) ?? []

    const _circleIds = circleIds?.length
      ? circleIds.filter((id) => assignedHalaqah.includes(id))
      : assignedHalaqah

    return _circleIds
  }

  async get(id: number, roleFilter?: RoleFilter) {
    let query = (await this.supabase)
      .from('students')
      .select(COLUMNS)
      .eq('id', id)

    if (roleFilter?.student_id) {
      query = query.eq('users.id', roleFilter?.student_id)
    } else if (roleFilter?.ustadz_id) {
      const circleIds = await this.getCircleByUstadz({
        ustadz_id: roleFilter?.ustadz_id
      })
      query = query.in('circle_id', circleIds)
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
    const circleIds = await this.getCircleByUstadz({
      ustadz_id: (await getUser()).data?.id ?? 0
    })

    const query = await (await this.supabase)
      .from('students')
      .select('id')
      .eq('id', id)
      .in('circle_id', circleIds)
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
