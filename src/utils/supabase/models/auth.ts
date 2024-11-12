import { Base } from "./base";

export class Auth extends Base {
  async get() {
    const result = await (await this.supabase).auth.getUser();
    return result.data.user;
  }
}
