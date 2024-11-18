import { string, number, object, array, boolean } from "yup";

const testTimestamp = (value?: string) => !value || !isNaN(Date.parse(value));

export const activityFilterSchema = object({
  start_date: string().test(
    "is-valid-date",
    "Date must be a valid ISO string",
    testTimestamp
  ),
  end_date: string().test(
    "is-valid-date",
    "Date must be a valid ISO string",
    testTimestamp
  ),
  type: number().oneOf([1, 2, 3] as const),
  limit: number().integer().min(1),
  offset: number().integer().min(0),
});

export const activityCreateSchema = object({
  notes: string().required(),
  tags: array().of(string()).required(),
  shift_id: number().required(),
  student_id: number().required(),
  type: number().oneOf([1, 2, 3] as const),
  achieve_target: boolean().required(),
  start_surah: number().required(),
  end_surah: number().required(),
  start_verse: number().required(),
  end_verse: number().required(),
  page_amount: number().required(),
  created_at: string().test(
    "is-valid-date",
    "Date must be a valid ISO string",
    testTimestamp
  ),
});
