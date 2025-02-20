import { Base } from './base'
import { RoleFilter } from '@/models/supabase/models/filter'
import { ApiError } from '@/utils/api-error'
import dayjs from '@/utils/dayjs'
import getTimezoneInfo from '@/utils/get-timezone-info'
interface GetFilter extends RoleFilter {
  start_date?: string
  end_date?: string
}

interface UpdatePayload {
  target_page_count?: number
}

export class Circles extends Base {
  async list(filter: GetFilter = {}) {
    const tz = await getTimezoneInfo()
    const day = dayjs().tz(tz)
    const {
      start_date = day.startOf('day').utc().toISOString(),
      end_date = day.endOf('day').utc().toISOString(),
      student_id,
      ustadz_id
    } = filter ?? {}

    const supabase = await this.supabase

    if (student_id) {
      const response = await supabase
        .from('circles')
        .select(
          `
            id,
            name,
            grade,
            students!inner(parent_id)
          `
        )
        .eq('students.parent_id', student_id)

      if (response.error) {
        throw new ApiError({
          message: response.error.message,
          code: response.error.code,
          status: response.status
        })
      }

      const data: NonNullable<typeof response.data> = response.data ?? []

      const result = {
        ...response,
        kind: 'student' as const,
        data: data.map((item) => ({
          id: item.id,
          name: item.name
        }))
      }

      return result
    }

    if (ustadz_id) {
      const response = await supabase
        .from('circles')
        .select(
          `
            id,
            name,
            grade,
            selected_shifts:shifts(ustadz_id),
            shifts(user: users!inner(name,id), ustadz_id, start_date, end_date, location),
            student_count:students(circle_id)
          `
        )
        .eq('selected_shifts.ustadz_id', ustadz_id)
        .gte('shifts.start_date', start_date)
        .or(`end_date.lte.${end_date},end_date.is.null`, {
          referencedTable: 'shifts'
        })
        .not('shifts', 'is', null)

      if (response.error) {
        throw new ApiError({
          message: response.error.message,
          code: response.error.code,
          status: response.status
        })
      }

      let _data =
        // The `selected_shift` is just a "placeholder" so that we can query the right halaqah related to ustadz_id.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        response.data?.map(({ selected_shifts: _selectedShifts, ...item }) => ({
          ...item,
          student_count: item.student_count.length
        })) ?? []

      _data = _data.filter((item) => {
        return item.shifts.find((item) => item.user.id === ustadz_id)
      })

      return {
        ...response,
        kind: 'ustadz' as const,
        data: _data
      }
    }

    const response = await supabase
      .from('circles')
      .select(
        `
        id,
        name,
        grade,
        selected_shifts:shifts(ustadz_id),
        shifts(user: users!inner(name,id), ustadz_id, start_date, end_date, location),
        student_count:students(circle_id)
      `
      )
      .gte('shifts.start_date', start_date)
      .or(`end_date.lte.${end_date},end_date.is.null`, {
        referencedTable: 'shifts'
      })
      .not('shifts', 'is', null)

    if (response.error) {
      throw new ApiError({
        message: response.error.message,
        code: response.error.code,
        status: response.status
      })
    }

    const data =
      // The `selected_shift` is just a "placeholder" so that we can query the right halaqah related to ustadz_id.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      response.data?.map(({ selected_shifts: _selectedShifts, ...item }) => ({
        ...item,
        student_count: item.student_count.length
      })) ?? []

    return {
      ...response,
      kind: 'ustadz' as const,
      data
    }
  }

  async get(id: number, filter?: GetFilter) {
    const tz = await getTimezoneInfo()
    const day = dayjs().tz(tz)

    const {
      // Start date should be lower than equal now.
      start_date = day.utc().toISOString(),
      end_date = day.endOf('day').utc().toISOString()
    } = filter ?? {}

    let query = (await this.supabase)
      .from('circles')
      .select(
        `
          id,
          name,
          label,
          grade,
          target_page_count,
          shifts (id, location, ustadz_id, users (name, id), start_date),
          students (id, name, parent_id)
        `
      )
      .eq('id', id)
      .lte('shifts.start_date', start_date)
      .or(`end_date.lte.${end_date},end_date.is.null`, {
        referencedTable: 'shifts'
      })

    if (filter?.ustadz_id) {
      query = query.eq('shifts.ustadz_id', filter?.ustadz_id)
    }

    if (filter?.student_id) {
      query = query.eq('students.parent_id', filter?.student_id)
    }
    const response = await query
      .order('start_date', { referencedTable: 'shifts', ascending: false })
      .limit(1)
      .single()

    if (response.error) {
      return response
    }

    let data: typeof response.data | null = response.data

    if (filter?.student_id) {
      data = data.students.length ? data : null
    }

    if (!data) {
      return null
    }

    const ustadz = data?.shifts?.[0]?.id
      ? {
          id: data?.shifts?.[0].users?.id,
          shiftId: data?.shifts?.[0]?.id,
          name: data?.shifts?.[0].users?.name
        }
      : null

    return {
      ...response,
      data: {
        id: data?.id,
        name: data?.name,
        label: data?.label,
        location: data?.shifts?.[0]?.location ?? '',
        shift_id: data?.shifts?.[0]?.id,
        ustadz: ustadz,
        target_page_count: data?.target_page_count,
        is_circle_managed_by_user: Boolean(filter?.ustadz_id)
          ? ustadz?.id === filter?.ustadz_id
          : false
      }
    }
  }

  async update(id: number, payload: Partial<UpdatePayload>) {
    return (await this.supabase).from('circles').update(payload).eq('id', id)
  }
}
