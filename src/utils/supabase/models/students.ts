import { Base } from "./base";

interface ListFilter {
  virtual_account?: string;
  pin?: string;
  id?: string;
  email?: string;
  halaqah_ids?: number[];
  parent_id?: number;
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
    const { virtual_account, pin, id, email, halaqah_ids, parent_id } = args;

    let query = (await this.supabase).from("students").select(this.columns);

    if (virtual_account) query = query.eq("virtual_account", virtual_account);
    if (pin) query = query.eq("pin", pin);
    if (id) query = query.eq("id", id);
    if (email) query = query.eq("users.email", email);
    if (halaqah_ids) query = query.in("halaqah_id", halaqah_ids);
    if (parent_id) query = query.eq("parent_id", parent_id);

    const result = await query;
    return result;
  }

  async get(id: number) {
    return await (await this.supabase)
      .from("students")
      .select(this.columns)
      .eq("id", id)
      .limit(1)
      .single();
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
