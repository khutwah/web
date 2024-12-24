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
    skipEncoding?: boolean
  } = {
    removeKeys: true,
    leadingSlash: true,
    includeKeys: ['from', 'id'],
    skipEncoding: true
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

    const encode = options.skipEncoding ? (v: string) => v : encodeURIComponent

    if (Array.isArray(value)) {
      const joinedValues = value.map(encode).join(',')
      pathParts.push(
        options.removeKeys
          ? `${joinedValues}`
          : `${encode(key)}/${joinedValues}`
      )
    } else {
      pathParts.push(
        options.removeKeys
          ? `${encode(value)}`
          : `${encode(key)}/${encode(value)}`
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

type ParamType = 'string' | 'number' | 'boolean' | 'array'
type ParseOptions = Record<string, ParamType>
type InferParsedParams<Options extends ParseOptions> = {
  [Key in keyof Options]: Options[Key] extends 'string'
    ? string
    : Options[Key] extends 'number'
      ? number
      : Options[Key] extends 'boolean'
        ? boolean
        : Options[Key] extends 'array'
          ? string[]
          : string
}
type NextSearchParams = { [key: string]: string | string[] | undefined }

/**
 * Parses search parameters based on provided options.
 * - If the value is an array but the desired type is not an array, it will return the first value
 * - If the value is not correct, it will be ommited
 *
 * @param options Optional configuration to infer the type of each parameter.
 * @returns Parsed parameters with inferred types.
 */
export function parseSearchParams<Options extends ParseOptions>(
  searchParams: NextSearchParams,
  options?: Options
): Partial<InferParsedParams<Options>> {
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(searchParams)) {
    const type = options?.[key] || 'string'

    switch (type) {
      case 'number':
        result[key] = Array.isArray(value) ? Number(value[0]) : Number(value)
        break
      case 'boolean':
        result[key] = Array.isArray(value)
          ? value[0] === 'true'
          : value === 'true'
        break
      case 'array':
        result[key] = Array.isArray(value) ? value : value ? [value] : []
        break
      default:
        result[key] = Array.isArray(value) ? value[0] : value || undefined
    }
  }

  return result as Partial<InferParsedParams<Options>>
}
