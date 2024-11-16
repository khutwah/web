import { PAGE_BY_ROLE } from "@/models/auth";
import { getUserRole } from "@/utils/supabase/get-user-role";
import { redirect } from "next/navigation";

/**
 * This page will be used as entry point only
 * and it will only work for redirect user to
 * the right access point by role.
 *
 * If the role exist but does not recognize.
 * We render this page instead.
 */
export default async function Home() {
  const role = await getUserRole();
  if (role === -1) return redirect("/login");

  const page = PAGE_BY_ROLE[role];
  if (page) redirect(page);

  return <div>Access Limited, please contact administrator.</div>;
}
