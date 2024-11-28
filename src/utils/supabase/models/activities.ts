import { PaginationFilter, RoleFilter } from '@/models/supabase/models/filter'
import { Base } from './base'
import { ActivityStatus, ActivityType } from '@/models/activities'
import surah from '@/data/surah.json'
import { getUserId } from '../get-user-id'
import { ApiError } from '@/utils/api-error'

export type StudentAttendance = 'presence' | 'absence'
export interface GetFilter extends RoleFilter, PaginationFilter {
  type?: ActivityType
  start_date?: string
  end_date?: string
  status?: ActivityStatus
  halaqah_ids?: number[]
  student_attendance?: StudentAttendance
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
  page_amount: number
  student_attendance: StudentAttendance
  created_at?: string
}

const selectQuery = `
    id,
    student_id,
    type,
    notes,
    tags,
    status,
    page_amount,
    created_at,
    start_surah,
    end_surah,
    start_verse,
    end_verse,
    student_attendance,
    shifts(ustadz_id, users(name), halaqah(name)),
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
      student_attendance
    } = args

    let query = (await this.supabase).from('activities').select(selectQuery)

    if (student_id) {
      query = query
        .eq('students.parent_id', student_id)
        .not('students', 'is', null)
    }

    if (ustadz_id) {
      query = query.eq('shifts.ustadz_id', ustadz_id)
    }

    if (type) {
      query = query.eq('type', type)
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
          page_amount: item.page_amount,
          created_at: item.created_at,
          start_surah: surah.find((s) => s.id === item.start_surah)
            ?.name_simple,
          start_surah_id: item.start_surah,
          end_surah: surah.find((s) => s.id === item.end_surah)?.name_simple,
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
      .select('id,created_by')
      .eq('id', id)
      .eq('created_by', userId)
      .limit(1)
      .maybeSingle()

    if (!result.data) {
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
}
