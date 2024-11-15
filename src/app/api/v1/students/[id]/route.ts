import { ERROR_CODES } from "@/models/error-translator";
import {
  createErrorResponse,
  createSuccessResponse,
} from "@/utils/api/response-generator";
import { errorTranslator } from "@/utils/supabase/error-translator";
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
        message: "Invalid payload data provided.",
      })
    );
  }

  const roleFilter = await getUserId();

  if (!roleFilter) {
    return Response.json(
      createErrorResponse({
        code: 403,
        message: "Unauthorize Access",
      })
    );
  }

  const student = new Students();
  const response = await student.get(id, roleFilter);

  if (response.error) {
    return Response.json(createErrorResponse(errorTranslator(response.error)));
  }

  if (!response?.data) {
    return Response.json(createErrorResponse(ERROR_CODES.PGRST116));
  }

  return Response.json(
    createSuccessResponse({
      data: response.data,
    })
  );
}
