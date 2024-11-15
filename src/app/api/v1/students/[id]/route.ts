import {
  createErrorResponse,
  createSuccessResponse,
} from "@/utils/api/response-generator";
import { getUserId } from "@/utils/supabase/get-user-id";
import { Students } from "@/utils/supabase/models/students";
import { validate } from "@/utils/validation/id";

interface ParamsType {
  params: Promise<{ id: string }>;
}
export async function GET(_request: Request, { params }: ParamsType) {
  const id = await validate(await params);

  if (!id) {
    return Response.json(
      createErrorResponse({
        code: 400,
        details: "Invalid payload data provided.",
      })
    );
  }

  const roleFilter = await getUserId();

  const student = new Students();
  const response = await student.get(id, roleFilter);

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
