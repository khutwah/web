import {
  createErrorResponse,
  createSuccessResponse,
} from "@/utils/api/response-generator";
import { Halaqah } from "@/utils/supabase/models/halaqah";
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

  const halaqah = new Halaqah();
  const response = await halaqah.get(id);

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
