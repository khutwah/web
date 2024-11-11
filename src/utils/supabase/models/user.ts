import { createClient } from "../client";

interface UserPayload {
  email: string;
  name: string;
  last_logged_in?: string;
  role: number;
  sb_user_id: string;
}

class User {
  instance: ReturnType<typeof createClient>;
  constructor() {
    this.instance = createClient();
  }

  create(payload: UserPayload) {
    return this.instance.from("users").upsert(payload);
  }

  update(email: string, payload: Partial<UserPayload>) {
    return this.instance.from("users").update(payload).eq("email", email);
  }

  async find(email: string) {
    const result = await this.instance
      .from("users")
      .select()
      .eq("email", email);

    return result?.data?.[0];
  }
}

const user = new User();

export default user;
