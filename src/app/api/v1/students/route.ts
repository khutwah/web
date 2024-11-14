import { ROLE } from "@/models/auth";
import {
  createErrorResponse,
  createSuccessResponse,
} from "@/utils/api/response-generator";
import { Auth } from "@/utils/supabase/models/auth";
import { Halaqah } from "@/utils/supabase/models/halaqah";
import { Students } from "@/utils/supabase/models/students";
import { User } from "@/utils/supabase/models/user";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const halaqahIds = searchParams.get("halaqah_ids");

  const auth = new Auth();
  const _auth = await auth.get();

  const user = new User();
  const _user = await user.get({
    email: _auth?.email || "",
  });

  const students = new Students();
  let _students: Awaited<ReturnType<typeof students.list>> | null = null;

  if (_user.data?.role === ROLE.STUDENT) {
    _students = await students.list({
      parent_id: _user.data.id,
    });
  } else if (_user.data?.role === ROLE.USTADZ) {
    const halaqah = new Halaqah();
    const response = await halaqah.list({
      ustadz_id: _user?.data?.id,
    });
    const _halaqahIds = halaqahIds
      ? halaqahIds.split(",").map(Number)
      : response?.data?.map((item) => item.id) ?? [];

    _students = await students.list({
      halaqah_ids: _halaqahIds,
    });
  }

  if (_students === null) {
    return Response.json(
      createErrorResponse({
        code: 403,
        details: "Unauthorize Access",
      })
    );
  }

  if (_students.error) {
    return Response.json(
      createErrorResponse({
        code: 500,
        details: "Something went wrong, please try again later.",
      })
    );
  }

  return Response.json(
    createSuccessResponse({
      data: _students.data,
    })
  );
}
