import {
  createErrorResponse,
  createSuccessResponse,
} from "@/utils/api/response-generator";
import { getUserId } from "@/utils/supabase/get-user-id";
import { Students } from "@/utils/supabase/models/students";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const roleFilter = await getUserId();

  if (!roleFilter) {
    return Response.json(
      createErrorResponse({
        code: 403,
        message: "Unauthorize Access",
      })
    );
  }

  const students = new Students();

  const searchParams = request.nextUrl.searchParams;
  const halaqahIds = searchParams.get("halaqah_ids");

  const parsedHalaqahIds = halaqahIds ? halaqahIds.split(",").map(Number) : [];

  const _students = await students.list({
    halaqah_ids: parsedHalaqahIds,
    ...roleFilter,
  });

  if (_students?.error) {
    return Response.json(
      createErrorResponse({
        code: 500,
        message: "Something went wrong, please try again later.",
      })
    );
  }

  return Response.json(
    createSuccessResponse({
      data: _students?.data,
    })
  );
}
