import { Base } from './base'
import { RoleFilter } from '@/models/supabase/models/filter'
import dayjsGmt7 from '@/utils/dayjs-gmt7'
interface GetFilter extends RoleFilter {
  start_date?: string
  end_date?: string
}

export class Halaqah extends Base {
  async list(filter: GetFilter) {
    const {
      start_date = dayjsGmt7().startOf('day').toISOString(),
      end_date = dayjsGmt7().endOf('day').toISOString(),
      student_id,
      ustadz_id
    } = filter ?? {}

    const supabase = await this.supabase

    if (student_id) {
      const response = await supabase
        .from('halaqah')
        .select('id, name, students!inner(parent_id)')
        .eq('students.parent_id', student_id)

      const data: NonNullable<typeof response.data> = response.data ?? []

      const result = {
        ...response,
        data: data.map((item) => ({
          id: item.id,
          name: item.name
        }))
      }

      return result
    }

    if (ustadz_id) {
      const response = await supabase
        .from('halaqah')
        .select(
          `
            id,
            name,
            shifts(ustadz_id, start_date, end_date),
            student_count:students(halaqah_id)
          `
        )
        .eq('shifts.ustadz_id', ustadz_id)
        .lte('shifts.start_date', start_date)
        .or(`end_date.gte.${end_date},end_date.is.null`, {
          referencedTable: 'shifts'
        })

      const _data =
        response.data?.map((item) => ({
          ...item,
          student_count: item.student_count.length
        })) ?? []

      return {
        ...response,
        data: _data
      }
    }

    return null
  }

  async get(id: number, filter?: GetFilter) {
    const {
      start_date = dayjsGmt7().startOf('day').toISOString(),
      end_date = dayjsGmt7().endOf('day').toISOString()
    } = filter ?? {}

    let query = (await this.supabase)
      .from('halaqah')
      .select(
        `
          id,
          name,
          label,
          shifts(id, location, ustadz_id, users(name, id), start_date),
          students(id, name, parent_id)
        `
      )
      .eq('id', id)
      .lte('shifts.start_date', start_date)
      .or(`end_date.gte.${end_date},end_date.is.null`, {
        referencedTable: 'shifts'
      })

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
        can_manage: Boolean(filter?.ustadz_id)
          ? ustadz?.id === filter?.ustadz_id
          : false
      }
    }
  }
}
