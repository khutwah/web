import { isNotNull } from "@/utils/is-not-null";
import { Base } from "./base";

interface ListFilter {
  student_id?: number;
  ustadz_id?: number;
}

export class Halaqah extends Base {
  async list({ student_id, ustadz_id }: ListFilter) {
    const supabase = await this.supabase;

    if (student_id) {
      const result = await supabase
        .from("students")
        .select("halaqah_id")
        .eq("parent_id", student_id);

      const halaqahIds: number[] =
        result.data?.map((item) => item.halaqah_id).filter(isNotNull) ?? [];

      const response = await supabase
        .from("halaqah")
        .select("id, name")
        .in("id", halaqahIds);

      return response;
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

  async get(id: number) {
    const response = await (
      await this.supabase
    )
      .from("halaqah")
      .select(
        `
          id,
          name,
          label,
          shifts(id, location, users(name, id))
        `
      )
      .eq("id", id)
      .limit(1)
      .single();

    if (response.error) {
      return response;
    }

    const ustadz = response.data.shifts?.[0]?.id
      ? {
          id: response.data.shifts?.[0].users?.id,
          name: response.data.shifts?.[0].users?.name,
        }
      : null;

    return {
      ...response,
      data: {
        id: response.data.id,
        name: response.data.name,
        label: response.data.label,
        location: response.data.shifts?.[0]?.location ?? "",
        ustadz: ustadz,
      },
    };
  }
}
