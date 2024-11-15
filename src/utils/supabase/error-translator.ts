import {
  DEFAULT_ERROR,
  ERROR_CODES,
  ErrorTranslatorResponse,
} from "@/models/error-translator";
import type { PostgrestError } from "@supabase/supabase-js";

export function errorTranslator(
  error: PostgrestError
): ErrorTranslatorResponse {
  return ERROR_CODES[error.code] ?? DEFAULT_ERROR;
}
