import { isEmail } from "./is-email";

export function isNeedMumtazLogin(username: string) {
  if (!isEmail(username)) {
    return false;
  }
  const pattern = /.*@(?:admin|ustadz)\..*/;
  return !pattern.test(username);
}
