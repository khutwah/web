import {
  createErrorResponse,
  createSuccessResponse,
} from "@/utils/api/response-generator";
import { getUserId } from "@/utils/supabase/get-user-id";

import { Halaqah } from "@/utils/supabase/models/halaqah";

export async function GET() {
  const roleFilter = await getUserId();
  if (!roleFilter) {
    return Response.json(
      createErrorResponse({
        code: 403,
        message: "Unauthorize Access",
      })
    );
  }

  const halaqah = new Halaqah();
  const response = await halaqah.list(roleFilter);

  if (response?.error) {
    return Response.json(
      createErrorResponse({
        code: 500,
        message: "Something went wrong, please try again later.",
      })
    );
  }

  return Response.json(
    createSuccessResponse({
      data: response?.data,
    })
  );
}
