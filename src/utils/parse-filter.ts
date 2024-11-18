import { NextRequest } from "next/server";

export function parseFilter(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const filters: Record<string, unknown> = {};
  for (const [key, value] of searchParams.entries()) {
    filters[key] = value;
  }
  return filters;
}
