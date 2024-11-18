import dayjs from "dayjs";
import { string, number, object } from "yup";

const testTimestamp = (value?: string) => !value || dayjs(value).isValid();
const transformToIsoString = (value: string) =>
  value ? dayjs.unix(Number(value)).toISOString() : undefined;

export const activityFilterSchema = object({
  start_date: string()
    .test(
      "is-valid-date",
      "Timestamp must represent a valid date",
      testTimestamp
    )
    .transform(transformToIsoString),
  end_date: string()
    .test(
      "is-valid-date",
      "Timestamp must represent a valid date",
      testTimestamp
    )
    .transform(transformToIsoString),
  type: number().oneOf([1, 2, 3] as const),
  limit: number().integer().min(1),
  offset: number().integer().min(0),
});
