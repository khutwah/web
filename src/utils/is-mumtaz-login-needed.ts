export function isMumtazLoginNeeded(username: string) {
  const pattern = /.*@(?:admin|ustadz|lajnah)\..*/
  return !pattern.test(username)
}
