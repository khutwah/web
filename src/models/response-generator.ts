export interface GeneralTypeResponse {
  status: "success" | "error";
  message: string;
}
export interface SuccessResponse extends GeneralTypeResponse {
  data: unknown;
}

export interface ErrorResponse extends GeneralTypeResponse {
  error: {
    details: string | ValidationError[];
    code: number;
  };
}

export interface CreateSuccessResponseArgs {
  data: unknown;
  message?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}
export interface CreateErrorResponseArgs {
  code: number;
  details: string | ValidationError[];
  message?: string;
}
