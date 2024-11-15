import { NOT_FOUND, SOMETHING_WENT_WRONG } from "./copywriting/data";

export interface ErrorTranslatorResponse {
  code: number;
  message: string;
}

export const ERROR_CODES: Record<string, ErrorTranslatorResponse> = {
  PGRST116: {
    code: 404,
    message: NOT_FOUND,
  },
};

export const DEFAULT_ERROR = {
  code: 500,
  message: SOMETHING_WENT_WRONG,
};
