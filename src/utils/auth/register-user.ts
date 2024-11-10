import { ROLE } from "@/models/auth";
import { createClient } from "../supabase/server";
import { RegisterUserArgs } from "@/models/register-user";

export async function registerUser({
  email,
  name,
  password,
}: RegisterUserArgs) {
  const supabase = await createClient();

  const { error: errorInsert } = await supabase.from("users").insert({
    email: email,
    name: name,
    last_logged_in: new Date().toISOString(),
    role: ROLE.STUDENT,
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
