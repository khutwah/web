import "server-only";

import { redirect } from "next/navigation";
import { getUserRole } from "../supabase/get-user-role";

export async function isHaveAccess(role: number) {
  const _role = await getUserRole();

  if (!_role) return redirect("/");
  if (_role !== role) return redirect("/");

  return true;
}
