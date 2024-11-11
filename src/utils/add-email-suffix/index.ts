import { isEmail } from "../is-email";

export function addEmailSuffix(input: string) {
  const email = isEmail(input)
    ? input
    : input + "@" + process.env.NEXT_PUBLIC_DEFAULT_EMAIL_DOMAIN;
  return email;
}
