"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { loginMumtaz } from "@/utils/auth/login-mumtaz";
import { registerUser } from "@/utils/auth/register-user";
import user from "@/utils/supabase/models/user";
import { ROLE } from "@/models/auth";

export async function login(_prevState: unknown, formData: FormData) {
  let isRedirect = false;
  const data = {
    email: formData.get("username") as string,
    password: formData.get("password") as string,
  };

  try {
    const mumtazResponse = await loginMumtaz({
      username: data.email,
      password: data.password,
    });

    const supabase = await createClient();

    /**
     * Logged in via mumtaz API
     */
    if (mumtazResponse) {
      const result = await user.find(data.email);
      const userIsNotRegistered = !result;

      if (userIsNotRegistered) {
        isRedirect = await registerUser({
          email: data.email,
          name: mumtazResponse.name,
          password: data.password,
          role: mumtazResponse.type === "student" ? ROLE.STUDENT : ROLE.USTADZ,
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

      try {
        /**
         * fire and forget
         * its ok if its fail as long
         * it does not break
         */
        await user.update(data.email, {
          last_logged_in: new Date().toISOString(),
        });
      } catch {}

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
