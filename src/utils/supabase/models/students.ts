import { Base } from "./base";

interface ListFilter {
  virtual_account?: string;
  pin?: string;
  id?: string;
  email?: string;
}

interface CreatePayload {
  parent_id: number;
  virtual_account: string;
  pin?: string;
  name: string;
}

export class Students extends Base {
  async list(args: ListFilter) {
    const { virtual_account, pin, id, email } = args;

    let query = (await this.supabase)
      .from("students")
      .select(`*, users (email)`);

    if (virtual_account) query = query.eq("virtual_account", virtual_account);
    if (pin) query = query.eq("pin", pin);
    if (id) query = query.eq("id", id);
    if (email) query = query.eq("users.email", email);

    const result = await query;
    return result;
  }

  async get(id: number) {
    return await (await this.supabase)
      .from("students")
      .select(`*, users (email)`)
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
