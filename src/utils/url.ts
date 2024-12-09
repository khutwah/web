export function extractPathnameAndQueryFromURL(url: URL) {
  const query = url.searchParams.toString()
  if (!query) return url.pathname

  return `${url.pathname}?${query}`
}
