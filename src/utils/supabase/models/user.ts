import { Base } from "./base";

interface UserPayload {
  email: string;
  name: string;
  last_logged_in?: string;
  role: number;
  sb_user_id: string;
}

export class User extends Base {
  async create(payload: UserPayload) {
    return (await this.supabase).from("users").upsert(payload).select();
  }

  async get(email: string) {
    const result = await (await this.supabase)
      .from("users")
      .select()
      .eq("email", email)
      .limit(1)
      .single();

    return result.data;
  }
}
