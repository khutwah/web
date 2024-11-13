export function isNeedMumtazLogin(username: string) {
  const pattern = /.*@(?:admin|ustadz)\..*/;
  return !pattern.test(username);
}
