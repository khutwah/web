import { ROLE } from "@/models/auth";
import {
  createErrorResponse,
  createSuccessResponse,
} from "@/utils/api/response-generator";
import { Auth } from "@/utils/supabase/models/auth";
import { Halaqah } from "@/utils/supabase/models/halaqah";
import { User } from "@/utils/supabase/models/user";

export async function GET() {
  const auth = new Auth();
  const _auth = await auth.get();

  const user = new User();
  const _user = await user.get({
    email: _auth?.email || "",
  });

  const key = _user.data?.role === ROLE.STUDENT ? "student_id" : "ustadz_id";

  const halaqah = new Halaqah();
  const response = await halaqah.list({
    [key]: _user?.data?.id,
  });

  if (response === null) {
    return Response.json(
      createErrorResponse({
        code: 403,
        details: "Unauthorize Access",
      })
    );
  }

  if (response.error) {
    return Response.json(
      createErrorResponse({
        code: 500,
        details: "Something went wrong, please try again later.",
      })
    );
  }

  return Response.json(
    createSuccessResponse({
      data: response.data,
    })
  );
}
