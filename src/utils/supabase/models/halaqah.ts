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
        .select()
        .in("id", halaqahIds);

      return response;
    }

    if (ustadz_id) {
      const result = await supabase
        .from("shifts")
        .select("halaqah_id")
        .eq("ustadz_id", ustadz_id)
        .or(`end_date.lt.${new Date().toISOString()},end_date.is.null`);

      const halaqahIds: number[] =
        result.data?.map((item) => item.halaqah_id).filter(isNotNull) ?? [];

      const response = await supabase
        .from("halaqah")
        .select()
        .in("id", halaqahIds);

      return response;
    }

    return null;
  }
}
