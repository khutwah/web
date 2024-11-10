"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { loginMumtaz } from "@/utils/auth/login-mumtaz";
import { registerUser } from "@/utils/auth/register-user";

export async function login(_prevState: unknown, formData: FormData) {
  let isRedirect = false;
  try {
    const data = {
      email: formData.get("username") as string,
      password: formData.get("password") as string,
    };

    const mumtazResponse = await loginMumtaz({
      username: data.email,
      password: data.password,
    });

    const supabase = await createClient();

    /**
     * Logged in via mumtaz API
     */
    if (mumtazResponse) {
      const result = await supabase
        .from("users")
        .select()
        .eq("email", data.email);

      const userIsNotRegistered = !result?.data?.length;

      if (userIsNotRegistered) {
        isRedirect = await registerUser({
          email: data.email,
          name: mumtazResponse.name,
          password: data.password,
        });
      }
    }

    if (!isRedirect) {
      /**
       * In-house sign in code will be reach if any of this condition met:
       * 1. Login via mumtaz failed (could be due to mumtaz API issue or login by ustadz)
       * 2. Login via mumtaz succeded, but user is already exist in our database
       */
      const { error: errorSignin } = await supabase.auth.signInWithPassword(
        data
      );
      if (errorSignin) throw errorSignin;

      isRedirect = true;
    }
  } catch (error) {
    const e = (error as Error).message;
    return {
      message: e,
    };
  } finally {
    if (isRedirect) {
      revalidatePath("/", "layout");
      redirect("/");
    }
  }
}
