"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  loginMumtaz,
  loginUsingPinPrep,
  successLoginStudentCallback,
} from "@/utils/auth/login-mumtaz";
import { INVALID_CREDENTIALS } from "@/models/copywriting/auth";
import { loginSupabase } from "@/utils/auth/login-supabase";
import { isNeedMumtazLogin } from "@/utils/is-need-mumtaz-login";

export async function login(_prevState: unknown, formData: FormData) {
  let redirectUri = "";

  const data = {
    username: formData.get("username") as string,
    password: formData.get("password") as string,
  };

  try {
    const isNeedMumtaz = isNeedMumtazLogin(data.username);

    if (isNeedMumtaz) {
      const { status, data: mumtazResponse } = await loginMumtaz({
        username: data.username,
        password: data.password,
      });

      /**
       * Logged in via mumtaz API
       */
      if (mumtazResponse) {
        redirectUri = await successLoginStudentCallback(mumtazResponse);
      } else if (status === 401) {
        throw new Error(INVALID_CREDENTIALS);
      } else {
        // Login using PIN
        redirectUri = await loginUsingPinPrep(data.username);
      }
    } else {
      /**
       * Ustad / Admin sign in
       */
      await loginSupabase({
        email: data.username,
        password: data.password,
      });

      redirectUri = "/";
    }
  } catch (error) {
    const e = (error as Error).message;
    return {
      message: e,
    };
  } finally {
    if (redirectUri) {
      revalidatePath(redirectUri, "layout");
      redirect(redirectUri);
    }
  }
}
