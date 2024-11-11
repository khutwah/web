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

  const { error: errorInsert } = await user.create({
    email,
    name,
    role,
  });

  if (errorInsert) {
    throw errorInsert;
  }

  const { error: errorSignUp } = await supabase.auth.signUp({
    email,
    password,
  });

  if (errorSignUp) throw errorSignUp;

  return true;
}
