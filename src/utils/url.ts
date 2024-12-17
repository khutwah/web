export function extractPathnameAndQueryFromURL(url: URL) {
  const query = url.searchParams.toString()
  if (!query) return url.pathname

  return `${url.pathname}?${query}`
}

export type FromQueryParams = {
  from?: 'santri' | 'halaqah' // FIXME: Move this somewhere.
  id?: number
}

export function addFromQueryString(params: FromQueryParams | undefined) {
  if (!params) return ''

  const qs = new URLSearchParams()
  if (params.from) qs.append('from', params.from)
  if (params.id !== undefined) qs.append('id', params.id.toString())
  const str = qs.toString()
  return str ? `?${str}` : ''
}

export function convertSearchParamsToPath(
  searchParams: { [key: string]: string | string[] | undefined },
  options: {
    removeKeys?: boolean
    leadingSlash?: boolean
    includeKeys?: string[]
  } = {
    removeKeys: true,
    leadingSlash: true,
    includeKeys: ['from', 'id']
  }
): string {
  const pathParts: string[] = []

  for (const key in searchParams) {
    if (
      Array.isArray(options.includeKeys) &&
      options.includeKeys.length > 0 &&
      !options.includeKeys.includes(key)
    )
      continue

    const value = searchParams[key]
    if (value === undefined) continue

    if (Array.isArray(value)) {
      const joinedValues = value.map(encodeURIComponent).join(',')
      pathParts.push(
        options.removeKeys
          ? `${joinedValues}`
          : `${encodeURIComponent(key)}/${joinedValues}`
      )
    } else {
      pathParts.push(
        options.removeKeys
          ? `${encodeURIComponent(value)}`
          : `${encodeURIComponent(key)}/${encodeURIComponent(value)}`
      )
    }
  }

  const resultPath = pathParts.join('/')
  return resultPath && options.leadingSlash ? `/${resultPath}` : resultPath
}

export function addQueryParams(
  url: string,
  searchParams: { [key: string]: string | string[] | undefined },
  options: {
    unique?: boolean
  } = {
    unique: true
  }
): string {
  const [baseUrl, existingQuery] = url.split('?')
  const urlSearchParams = new URLSearchParams(existingQuery)

  for (const key in searchParams) {
    const value = searchParams[key]
    if (value === undefined) continue

    if (Array.isArray(value)) {
      value.forEach((v) => urlSearchParams.append(key, v))
    } else {
      if (options?.unique) {
        urlSearchParams.set(key, value)
      } else {
        urlSearchParams.append(key, value)
      }
    }
  }

  const queryString = urlSearchParams.toString()
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}

export function convertSearchParamsToStringRecords(searchParams: {
  [key: string]: string | string[] | undefined
}): Record<string, string> {
  const result: Record<string, string> = {}

  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === 'string') {
      result[key] = value
    }
  }

  return result
}
