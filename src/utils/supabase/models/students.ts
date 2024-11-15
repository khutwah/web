import { RoleFilter } from "@/models/supabase/models/filter";
import { Base } from "./base";
import { Halaqah } from "./halaqah";

interface ListFilter extends RoleFilter {
  virtual_account?: string;
  pin?: string;
  email?: string;
  halaqah_ids?: number[];
}

interface CreatePayload {
  parent_id: number;
  virtual_account: string;
  pin?: string;
  name: string;
}

export class Students extends Base {
  columns: string = "id, name, users (id, email), halaqah (id, name)";

  async list(args: ListFilter) {
    const { virtual_account, pin, email, student_id, ustadz_id, halaqah_ids } =
      args;

    let query = (await this.supabase).from("students").select(this.columns);

    if (virtual_account) query = query.eq("virtual_account", virtual_account);
    if (pin) query = query.eq("pin", pin);
    if (email) query = query.eq("users.email", email);
    if (student_id) query = query.eq("parent_id", student_id);
    if (ustadz_id) {
      const halaqahIds = await this.getHalaqahByUstad({
        ustadz_id: ustadz_id,
        halaqahIds: halaqah_ids,
      });
      query = query.in("halaqah_id", halaqahIds);
    }

    const result = await query;
    return result;
  }

  async getHalaqahByUstad({
    ustadz_id,
    halaqahIds,
  }: {
    ustadz_id: number;
    halaqahIds?: number[];
  }) {
    const halaqah = new Halaqah();
    const response = await halaqah.list({
      ustadz_id: ustadz_id,
    });
    const assignedHalaqah = response?.data?.map((item) => item.id) ?? [];

    const _halaqahIds = halaqahIds?.length
      ? halaqahIds.filter((id) => assignedHalaqah.includes(id))
      : assignedHalaqah;

    return _halaqahIds;
  }

  async get(id: number, roleFilter?: RoleFilter) {
    let query = (await this.supabase)
      .from("students")
      .select(this.columns)
      .eq("id", id);

    if (roleFilter?.student_id) {
      query = query.eq("users.id", roleFilter?.student_id);
    } else if (roleFilter?.ustadz_id) {
      const halaqahIds = await this.getHalaqahByUstad({
        ustadz_id: roleFilter?.ustadz_id,
      });
      query = query.in("halaqah_id", halaqahIds);
    }

    const response = await query.limit(1).single();

    // @ts-expect-error - optional chaining used
    const data = response?.data?.users ? response.data : null;

    return {
      ...response,
      data,
    };
  }

  async create(payload: CreatePayload) {
    return (await this.supabase).from("students").insert(payload);
  }

  async update(userId: number, payload: Partial<CreatePayload>) {
    return (await this.supabase)
      .from("students")
      .update(payload)
      .eq("parent_id", userId);
  }
}
