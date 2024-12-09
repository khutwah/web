import { PaginationFilter, RoleFilter } from '@/models/supabase/models/filter'
import { Base } from './base'
import { ActivityStatus, ActivityType } from '@/models/activities'
import surah from '@/data/surah.json'
import { getUserId } from '../get-user-id'
import { ApiError } from '@/utils/api-error'
import dayjs from 'dayjs'

export type StudentAttendance = 'present' | 'absent'

export interface GetFilter extends RoleFilter, PaginationFilter {
  type?: ActivityType
  start_date?: string
  end_date?: string
  status?: ActivityStatus
  halaqah_ids?: number[]
  student_attendance?: StudentAttendance
  order_by?: 'asc' | 'desc'
  limit?: number
}

interface ActivitiesPayload {
  shift_id: number
  notes: string
  tags: string[]
  student_id: number
  type: ActivityType
  status: ActivityStatus
  achieve_target: boolean
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
    achieve_target,
    shifts(id, ustadz_id, users(name), halaqah(name)),
    students(parent_id, id, name)`

export class Activities extends Base {
  async list(args: GetFilter) {
    const {
      student_id,
      halaqah_ids,
      ustadz_id,
      limit = 10,
      offset = 0,
      type,
      start_date,
      end_date,
      student_attendance,
      order_by,
      status
    } = args

    let query = (await this.supabase).from('activities').select(selectQuery)

    if (student_id) {
      query = query.eq('students.id', student_id).not('students', 'is', null)
    }

    if (ustadz_id) {
      query = query.eq('shifts.ustadz_id', ustadz_id).not('shifts', 'is', null)
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

    if (halaqah_ids && halaqah_ids.length) {
      query = query
        .in('shifts.halaqah_id', halaqah_ids)
        .not('shifts', 'is', null)
    }

    if (student_attendance) {
      query = query.eq('student_attendance', student_attendance)
    }

    if (order_by) {
      query = query.order('created_at', { ascending: order_by === 'asc' })
    }

    if (limit) {
      query = query.limit(limit)
    }

    const result = await query.range(offset, offset + limit - 1)
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
          start_surah: surah.find((s) => s.id === item.start_surah)?.name,
          start_surah_id: item.start_surah,
          end_surah: surah.find((s) => s.id === item.end_surah)?.name,
          end_surah_id: item.end_surah,
          start_verse: item.start_verse,
          end_verse: item.end_verse,
          halaqah_name: item.shifts?.halaqah?.name,
          student_attendance: item.student_attendance
        }))
      : result.data

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

  async create(payload: ActivitiesPayload) {
    const userId = Object.values((await getUserId()) ?? {})[0]

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

    return await (await this.supabase).from('activities').insert(_payload)
  }

  async update(id: number, payload: ActivitiesPayload) {
    const userId = Object.values((await getUserId()) ?? {})[0]
    const supabase = await this.supabase

    const result = await supabase
      .from('activities')
      .select('id, created_by, shifts!inner(id, ustadz_id)')
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

  async chart({ student_id, start_date, end_date }: ActivitiesForChart) {
    const supabase = await this.supabase

    const checkpoint = await supabase
      .from('checkpoint')
      .select('last_activity_id, page_count_accumulation')
      .order('id', { ascending: false })
      .eq('student_id', student_id)
      .lt('created_at', end_date)
      .limit(1)
      .maybeSingle()

    const activities = await supabase
      .from('activities')
      .select(
        'id, page_count, target_page_count, created_at, status, student_attendance'
      )
      .eq('student_id', student_id)
      .eq('status', ActivityStatus.completed)
      .eq('type', ActivityType.Sabaq)
      .gte('created_at', start_date)
      .lte('created_at', end_date)
      .order('id', { ascending: true })

    let pageCountStart = checkpoint.data?.page_count_accumulation ?? 0

    if (checkpoint.data?.last_activity_id) {
      // Deduct pageCountStart if there is activity is found
      // before reaching checkpoint
      // because page_count_accumulation already include
      // those page_count numbers
      activities.data?.forEach((item) => {
        if (item.id <= checkpoint.data!.last_activity_id) {
          pageCountStart -= item.page_count || 0
        }
      })
    }

    const data =
      activities.data?.map((item, index) => {
        pageCountStart += item.page_count || 0

        return {
          id: item.id,
          target_page_count: item.target_page_count * (index + 1),
          page_count:
            item.student_attendance !== 'present' ||
            item.status !== ActivityStatus.completed
              ? null
              : pageCountStart,
          created_at: dayjs(item.created_at).startOf('day').toISOString(),
          student_attendance: item.student_attendance
        }
      }) ?? []

    return data
  }
}
