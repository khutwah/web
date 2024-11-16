import "server-only";

import { redirect } from "next/navigation";
import { getUserRole } from "../supabase/get-user-role";
import { PAGE_BY_ROLE } from "@/models/auth";

export async function isHaveAccess(role: number) {
  const _role = await getUserRole();

  // User has no access
  if (_role === -1) return redirect("/");

  // User not eligible to access expected page
  if (_role !== role) return redirect(PAGE_BY_ROLE[_role] ?? "/");

  return true;
}
