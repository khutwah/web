import {
  PaginationFilter,
  RoleFilter,
  QueryOptions
} from '@/models/supabase/models/filter'
import { Base } from './base'
import { ActivityStatus, ActivityType } from '@/models/activities'
import surahs from '@/data/mushaf/surahs.json'
import { getUserId } from '../get-user-id'
import { ApiError } from '@/utils/api-error'
import dayjs from '@/utils/dayjs'
import { TAG_LAJNAH_ASSESSMENT_ONGOING } from '@/models/checkpoints'

export type StudentAttendance = 'present' | 'absent'

export interface GetFilter extends RoleFilter, PaginationFilter {
  parent_id?: number
  type?: ActivityType
  start_date?: string
  end_date?: string
  status?: ActivityStatus
  circle_ids?: number[]
  student_attendance?: StudentAttendance
  order_by?: Array<[string, 'asc' | 'desc']>
  limit?: number
  current_user_id?: number
  student_ids?: number[]
}

interface ActivitiesPayload {
  shift_id: number
  notes: string
  tags: string[]
  student_id: number
  type: ActivityType
  status: ActivityStatus
  is_target_achieved: boolean
  start_surah: number
  end_surah: number
  start_verse: number
  end_verse: number
  page_count: number
  target_page_count: number
  student_attendance: StudentAttendance
  created_at?: string
}

interface ActivitiesForChart {
  student_id: number
  start_date: string
  end_date: string
  tz: string
}

const selectQuery = `
    id,
    student_id,
    type,
    notes,
    tags,
    status,
    target_page_count,
    page_count,
    created_at,
    start_surah,
    end_surah,
    start_verse,
    end_verse,
    student_attendance,
    is_target_achieved,
    created_by,
    shift:shifts (id, ustadz_id, users (name), circle:circles (name)),
    students (parent_id, id, name)
    `

export class Activities extends Base {
  async _getUserId() {
    const userId = Object.values((await getUserId()) ?? {})[0]
    return userId
  }

  async list(args: GetFilter, options?: QueryOptions) {
    const {
      student_id,
      parent_id,
      circle_ids,
      ustadz_id,
      limit = 10,
      offset = 0,
      type,
      start_date,
      end_date,
      student_attendance,
      order_by,
      status,
      current_user_id,
      student_ids
    } = args

    // We skip limiting when count is requested && limit === undefined.
    const limiting = !options || (!options.count && limit !== undefined)

    let query = (await this.supabase)
      .from('activities')
      .select(selectQuery, options)

    if (student_id) {
      query = query.eq('students.id', student_id).not('students', 'is', null)
    }

    if (Array.isArray(student_ids) && student_ids.length > 0) {
      query = query.in('students.id', student_ids).not('students', 'is', null)
    }

    if (parent_id) {
      query = query
        .eq('students.parent_id', parent_id)
        .not('students', 'is', null)
    }

    if (ustadz_id) {
      query = query.eq('shift.ustadz_id', ustadz_id).not('shift', 'is', null)
    }

    if (type) {
      query = query.eq('type', type)
    }

    if (status) {
      query = query.eq('status', status)
    }

    if (start_date) {
      query = query.gte('created_at', start_date)
    }

    if (end_date) {
      query = query.lte('created_at', end_date)
    }

    if (Array.isArray(circle_ids) && circle_ids.length > 0) {
      query = query.in('shift.circle_id', circle_ids).not('shift', 'is', null)
    }

    if (student_attendance) {
      query = query.eq('student_attendance', student_attendance)
    }

    if (order_by) {
      order_by.forEach((o) => {
        query = query.order(o[0], { ascending: o[1] === 'asc' })
      })
    }

    if (limiting && limit) {
      query = query.limit(limit)
      query.range(offset, offset + limit - 1)
    }

    const result = await query
    if (result.error) {
      throw new ApiError({
        message: result.error.message,
        code: result.error.code,
        status: result.status
      })
    }

    const userId = current_user_id ?? (await this._getUserId())

    const data = result.data
      ? result.data.map((item) => ({
          id: item.id,
          student_id: item.students?.id,
          student_name: item.students?.name,
          type: ActivityType[item.type ?? 1],
          notes: item.notes,
          status: item.status,
          tags: item.tags ?? [],
          target_page_count: item.target_page_count,
          page_count: item.page_count,
          created_at: item.created_at,
          start_surah: surahs.find((s) => s.id === item.start_surah)?.name,
          start_surah_id: item.start_surah,
          end_surah: surahs.find((s) => s.id === item.end_surah)?.name,
          end_surah_id: item.end_surah,
          start_verse: item.start_verse,
          end_verse: item.end_verse,
          circle_name: item.shift?.circle?.name,
          student_attendance: item.student_attendance,
          created_by: item.created_by,
          has_edit_access: item.created_by === userId
        }))
      : []

    return {
      ...result,
      data
    }
  }

  async get(id: number) {
    return (await this.supabase)
      .from('activities')
      .select(selectQuery)
      .eq('id', id)
      .limit(1)
      .maybeSingle()
  }

  async listForDay(id: number, types: ActivityType[], day: dayjs.Dayjs) {
    const startOfDay = day.startOf('day').toISOString()
    const endOfDay = day.endOf('day').toISOString()

    return (await this.supabase)
      .from('activities')
      .select(selectQuery)
      .eq('student_id', id)
      .in('type', types)
      .gte('created_at', startOfDay)
      .lte('created_at', endOfDay)
  }

  async count(args: GetFilter) {
    const countArgs = { ...args, limit: undefined, offset: undefined }
    return (await this.list(countArgs, { head: true, count: 'exact' })).count
  }

  async create(payload: ActivitiesPayload) {
    const userId = await this._getUserId()

    let _payload: ActivitiesPayload & {
      updated_at?: string
      created_by: number
    } = { ...payload, created_by: userId }

    if (payload.created_at) {
      _payload = {
        ..._payload,
        updated_at: payload.created_at
      }
    }

    return await (await this.supabase)
      .from('activities')
      .insert(_payload)
      .select('id')
  }

  async getLatestSabaq({
    parentId,
    studentId
  }: {
    parentId?: number
    studentId?: number
  }) {
    if (!parentId && !studentId) {
      throw new Error('parentId or studentId is required')
    }
    let query = (await this.supabase)
      .from('zzz_view_latest_student_sabaq_activities')
      .select('id, student_id, target_page_count, end_surah, end_verse')
    if (parentId) {
      query = query.eq('parent_id', parentId)
    }
    if (studentId) {
      query = query.eq('student_id', studentId)
    }

    const { data, error } = await query.maybeSingle()
    if (error) {
      // We simply ignore any errors for now.
      return null
    }
    return data
  }

  async listLatestSabaq(studentIds: number[]) {
    const query = (await this.supabase)
      .from('zzz_view_latest_student_sabaq_activities')
      .select('id, student_id, target_page_count, end_surah, end_verse')
      .in('student_id', studentIds)

    const { data, error } = await query
    if (error) {
      // We simply ignore any errors for now.
      return []
    }
    return data
  }

  async convertToDraft(id: number) {
    return (await this.supabase)
      .from('activities')
      .update({ status: ActivityStatus.draft })
      .eq('id', id)
  }

  async updateTargetPageCount(id: number, target_page_count: number) {
    const supabase = await this.supabase
    return supabase
      .from('activities')
      .update({ target_page_count })
      .eq('id', id)
  }

  async update(id: number, payload: ActivitiesPayload) {
    const userId = await this._getUserId()
    const supabase = await this.supabase

    const result = await supabase
      .from('activities')
      .select('id, created_by, shifts!inner (id, ustadz_id)')
      .eq('id', id)
      .limit(1)
      .maybeSingle()

    if (!result.data) {
      throw new ApiError({
        message: 'Not Found',
        code: '404',
        status: 404
      })
    }

    if (
      result.data.shifts.ustadz_id !== userId &&
      result.data.created_by !== userId
    ) {
      throw new ApiError({
        message: 'You are not authorize to perform this action',
        code: '403',
        status: 403
      })
    }

    const response = await supabase
      .from('activities')
      .update(payload)
      .eq('id', id)

    if (response.error) {
      throw new ApiError({
        message: response.error.message,
        code: response.error.code,
        status: response.status
      })
    }
    return response
  }

  async checkpoint({ student_id }: { student_id: number }) {
    const supabase = await this.supabase
    const checkpoints = await supabase
      .from('checkpoints')
      .select(
        'last_activity_id, page_count_accumulation, end_date, part_count, notes, status'
      )
      .order('id', { ascending: false })
      .eq('student_id', student_id)
      .limit(1)
      .maybeSingle()

    if (checkpoints.data?.end_date === null) {
      return {
        last_activity_id: checkpoints.data.last_activity_id,
        page_count_accumulation: checkpoints.data.page_count_accumulation,
        part_count: checkpoints.data.part_count,
        notes: checkpoints.data.notes,
        status: checkpoints.data.status
      }
    }

    const lastActivityId = checkpoints.data?.last_activity_id
    const pageCountAccumulation = checkpoints.data?.page_count_accumulation ?? 0

    let activities = supabase
      .from('activities')
      .select('id, page_count')
      .eq('student_id', student_id)
      .eq('type', ActivityType.Sabaq)
      .eq('status', ActivityStatus.completed)
      .not('tags', 'cs', JSON.stringify([TAG_LAJNAH_ASSESSMENT_ONGOING]))

    if (lastActivityId) {
      activities = activities.gt('id', lastActivityId)
    }

    const result = await activities.order('id', { ascending: false })

    const pageCounts =
      result.data?.reduce((acc, item) => {
        return acc + (item.page_count ?? 0)
      }, 0) ?? 0

    return {
      last_activity_id: result.data?.[0]?.id ?? lastActivityId,
      page_count_accumulation: pageCounts + pageCountAccumulation,
      part_count: undefined,
      notes: undefined,
      status: undefined
    }
  }

  async chart({ student_id, start_date, end_date, tz }: ActivitiesForChart) {
    const supabase = await this.supabase
    const [initial, activities] = await Promise.all([
      this.prisma.activities.aggregate({
        _sum: {
          page_count: true,
          target_page_count: true
        },
        where: {
          student_id,
          status: ActivityStatus.completed,
          type: ActivityType.Sabaq,
          student_attendance: 'present',
          tags: {
            not: {
              has: JSON.stringify([TAG_LAJNAH_ASSESSMENT_ONGOING])
            }
          },
          created_at: {
            lte: start_date
          }
        }
      }),
      supabase
        .from('activities')
        .select(
          'id, page_count, target_page_count, created_at, status, student_attendance'
        )
        .eq('student_id', student_id)
        .eq('status', ActivityStatus.completed)
        .eq('type', ActivityType.Sabaq)
        .gte('created_at', start_date)
        .lte('created_at', end_date)
        .not('tags', 'cs', JSON.stringify([TAG_LAJNAH_ASSESSMENT_ONGOING]))
        .order('id', { ascending: true })
    ])

    let pageCount = initial._sum.page_count || 0
    let targetPageCount = initial._sum.target_page_count || 0
    const data =
      activities.data?.map((item) => {
        pageCount += item.page_count || 0
        targetPageCount += item.target_page_count
        return {
          id: item.id,
          target_page_count: targetPageCount,
          page_count:
            item.student_attendance !== 'present' ||
            item.status !== ActivityStatus.completed
              ? null
              : pageCount,
          // Note: this is intended so that every tick in X axis is always at the start of day.
          // Also this should consider the timezone of the user.
          // FIXME(dio-khutwah): Probably this should be handled at the caller site,
          // so we don't need to trickle down the timezone to model layer.
          created_at: dayjs
            .utc(item.created_at)
            .tz(tz) // item.created_at is in UTC, but we want to get the start of day in user's timezone.
            .startOf('day')
            .toISOString(),
          student_attendance: item.student_attendance
        }
      }) ?? []

    return data
  }
}
