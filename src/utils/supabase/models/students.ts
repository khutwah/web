import { Base } from "./base";

interface ListFilter {
  virtual_account?: string;
}

interface CreatePayload {
  parent_id: number;
  virtual_account: string;
}

export class Students extends Base {
  async list(args: ListFilter) {
    const { virtual_account } = args;

    let query = (await this.supabase).from("students").select();

    if (virtual_account) query = query.eq("virtual_account", virtual_account);

    const result = await query;
    return result;
  }

  async create(payload: CreatePayload) {
    return (await this.supabase).from("students").upsert(payload);
  }
}
