"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { loginMumtaz } from "@/utils/auth/login-mumtaz";
import { registerUser } from "@/utils/auth/register-user";
import { ROLE } from "@/models/auth";
import { addEmailSuffix } from "@/utils/add-email-suffix";
import { Students } from "@/utils/supabase/models/students";

export async function login(_prevState: unknown, formData: FormData) {
  let isRedirect = false;
  const data = {
    username: formData.get("username") as string,
    password: formData.get("password") as string,
    email: addEmailSuffix(formData.get("username") as string),
  };

  try {
    const mumtazResponse = await loginMumtaz({
      username: data.username,
      password: data.password,
    });

    const supabase = await createClient();

    /**
     * Logged in via mumtaz API
     */
    if (mumtazResponse) {
      const student = new Students();
      const studentResult = await student.list({
        virtual_account: mumtazResponse.virtual_account,
      });
      const userIsNotRegistered = !studentResult.data?.length;

      if (userIsNotRegistered) {
        isRedirect = await registerUser({
          email: data.email,
          name: mumtazResponse.name,
          password: data.password,
          role: mumtazResponse.type === "student" ? ROLE.STUDENT : ROLE.USTADZ,
          virtual_account: mumtazResponse.virtual_account,
        });
      }
    }

    if (!isRedirect) {
      /**
       * In-house sign in code will be reach if any of this condition met:
       * 1. Login via mumtaz failed (could be due to mumtaz API issue or login by ustadz)
       * 2. Login via mumtaz succeded, but user is already exist in our database
       */
      const { error: errorSignin } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
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
