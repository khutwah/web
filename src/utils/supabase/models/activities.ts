import { PaginationFilter, RoleFilter } from "@/models/supabase/models/filter";
import { Base } from "./base";
import { ActivityType } from "@/models/activities";
import surah from "@/data/surah.json";

export interface GetFilter extends RoleFilter, PaginationFilter {
  type?: ActivityType;
  start_date?: string;
  end_date?: string;
}

const selectQuery = `
    student_id,
    type,
    notes,
    tags,
    page_amount,
    created_at,
    start_surah,
    end_surah,
    start_verse,
    end_verse,
    shifts(ustadz_id, users(name)),
    students(parent_id)`;

export class Activities extends Base {
  async list(args: GetFilter) {
    const {
      student_id,
      ustadz_id,
      limit = 10,
      offset = 0,
      type,
      start_date,
      end_date,
    } = args;

    let query = (await this.supabase).from("activities").select(selectQuery);

    if (student_id) {
      query = query
        .eq("students.parent_id", student_id)
        .not("students", "is", null);
    }

    if (ustadz_id) {
      query = query.eq("shifts.ustadz_id", ustadz_id);
    }

    if (type) {
      query = query.eq("type", type);
    }

    if (start_date) {
      query = query.gte("created_at", start_date);
    }

    if (end_date) {
      query = query.lte("created_at", end_date);
    }

    const result = await query.range(offset, offset + limit - 1);
    const data = result.data
      ? result.data.map((item) => ({
          type: ActivityType[item.type ?? 1],
          notes: item.notes,
          tags: JSON.parse(item.tags ?? "[]"),
          page_amount: item.page_amount,
          created_at: item.created_at,
          start_surah: surah.find((s) => s.id === item.start_surah)
            ?.name_simple,
          end_surah: surah.find((s) => s.id === item.end_surah)?.name_simple,
          start_verse: item.start_verse,
          end_verse: item.end_verse,
        }))
      : result.data;

    return {
      ...result,
      data,
    };
  }
}
