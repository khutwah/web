import { isNotNull } from "@/utils/is-not-null";
import { Base } from "./base";
import { RoleFilter } from "@/models/supabase/models/filter";

export class Halaqah extends Base {
  async list({ student_id, ustadz_id }: RoleFilter) {
    const supabase = await this.supabase;

    if (student_id) {
      const response = await supabase
        .from("halaqah")
        .select("id, name, students(parent_id)")
        .eq("students.parent_id", student_id);

      const data: NonNullable<typeof response.data> =
        response.data?.filter((item) => Boolean(item.students.length)) ?? [];

      const result = {
        ...response,
        data: data.map((item) => ({
          id: item.id,
          name: item.name,
        })),
      };

      return result;
    }

    if (ustadz_id) {
      const result = await supabase
        .from("shifts")
        .select("halaqah_id")
        .eq("ustadz_id", ustadz_id)
        .lt("start_date", new Date().toISOString())
        .or(`end_date.gt.${new Date().toISOString()},end_date.is.null`);

      const halaqahIds: number[] =
        result.data?.map((item) => item.halaqah_id).filter(isNotNull) ?? [];

      const response = await supabase
        .from("halaqah")
        .select("id, name")
        .in("id", halaqahIds);

      return response;
    }

    return null;
  }

  async get(id: number, roleFilter?: RoleFilter) {
    let query = (await this.supabase)
      .from("halaqah")
      .select(
        `
          id,
          name,
          label,
          shifts(id, location, ustadz_id, users(name, id)),
          students(id, name, parent_id)
        `
      )
      .eq("id", id);

    if (roleFilter?.ustadz_id) {
      query = query.eq("shifts.ustadz_id", roleFilter?.ustadz_id);
    } else if (roleFilter?.student_id) {
      query = query.eq("students.parent_id", roleFilter?.student_id);
    }

    const response = await query.limit(1).single();

    if (response.error) {
      return response;
    }

    let data: typeof response.data | null = response.data;

    if (roleFilter?.ustadz_id) {
      data = data.shifts.length ? data : null;
    } else if (roleFilter?.student_id) {
      data = data.students.length ? data : null;
    }

    if (!data) {
      return null;
    }

    const ustadz = data?.shifts?.[0]?.id
      ? {
          id: data?.shifts?.[0].users?.id,
          name: data?.shifts?.[0].users?.name,
        }
      : null;

    return {
      ...response,
      data: {
        id: data?.id,
        name: data?.name,
        label: data?.label,
        location: data?.shifts?.[0]?.location ?? "",
        ustadz: ustadz,
      },
    };
  }
}
