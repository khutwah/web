import { PAGE_BY_ROLE } from "@/models/auth";
import { getUserRole } from "@/utils/supabase/get-user-role";
import { redirect } from "next/navigation";

/**
 * This page will be used as entry point only
 * and it will only work for redirect user to
 * the right access point by role.
 */
export default async function Home() {
  const role = await getUserRole();
  const page = PAGE_BY_ROLE[role];
  if (!page) redirect("/login");

  redirect(page);

  return <div>hello world</div>;
}
