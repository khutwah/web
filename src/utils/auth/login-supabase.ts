import { loginSupabaseArgs } from "@/models/login-supabase";
import { createClient } from "../supabase/server";

export async function loginSupabase(args: loginSupabaseArgs) {
  const supabase = await createClient();

  const { error: errorSignin } = await supabase.auth.signInWithPassword({
    email: args.email,
    password: args.password,
  });
  if (errorSignin) throw errorSignin;

  return true;
}
