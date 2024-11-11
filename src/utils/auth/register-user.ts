import { createClient } from "../supabase/server";
import { RegisterUserArgs } from "@/models/register-user";
import user from "../supabase/models/user";

export async function registerUser({
  email,
  name,
  password,
  role,
}: RegisterUserArgs) {
  const supabase = await createClient();

  const response = await supabase.auth.signUp({
    email,
    password,
  });

  if (response.error) throw response.error;

  const { error: errorInsert } = await user.create({
    email,
    name,
    role,
    sb_user_id: response.data.user?.id ?? "",
  });

  if (errorInsert) {
    throw errorInsert;
  }

  return true;
}
