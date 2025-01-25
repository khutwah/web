import { NextSearchParams } from '@/models/url'
import { ReadonlyURLSearchParams } from 'next/navigation'

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

export function convertReadonlyURLSearchParamsToPlainObject(
  params: ReadonlyURLSearchParams
): { [key: string]: string | string[] | undefined } {
  const result: { [key: string]: string | string[] | undefined } = {}

  params.forEach((value, key) => {
    if (result[key] === undefined) {
      result[key] = value
    } else if (Array.isArray(result[key])) {
      ;(result[key] as string[]).push(value)
    } else {
      result[key] = [result[key] as string, value]
    }
  })

  return result
}

export function convertSearchParamsToStringRecords(
  searchParams: { [key: string]: string | string[] | undefined },
  excludeKeys: string[] = [] // Optional array of keys to exclude
): Record<string, string> {
  const result: Record<string, string> = {}

  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === 'string' && !excludeKeys.includes(key)) {
      result[key] = value
    }
  }

  return result
}

type ParamType = 'string' | 'number' | 'boolean' | 'array'
type ParseOptions = Record<string, ParamType>
type InferParsedParams<Options extends ParseOptions> = {
  [Key in keyof Options]?: Options[Key] extends 'string'
    ? string
    : Options[Key] extends 'number'
      ? number
      : Options[Key] extends 'boolean'
        ? boolean
        : Options[Key] extends 'array'
          ? string[]
          : string
}

/**
 * Parses search parameters based on provided options.
 * - If the value is an array but the expected type is not an array, it will return the first value
 * - If the type of the value is not the same as expected, it will be ommited
 *
 * @param options Optional configuration to infer the type of each parameter.
 * @returns Parsed parameters with inferred types.
 */
export function parseSearchParams<Options extends ParseOptions>(
  searchParams: Readonly<URLSearchParams> | NextSearchParams,
  options: Options
): Partial<InferParsedParams<Options>> {
  const result: Record<string, unknown> = {}

  const getParamValue = (key: string): string | string[] | undefined => {
    if (searchParams instanceof URLSearchParams) {
      // Handle URLSearchParams (e.g. from useSearchParams)
      const values = searchParams.getAll(key)
      return values.length > 1 ? values : values[0] || undefined
    } else {
      // Handle plain object (e.g. from Server Component props)
      return (searchParams as NextSearchParams)[key]
    }
  }

  for (const [key, type] of Object.entries(options)) {
    const value = getParamValue(key)

    if (value === undefined) continue // Skip undefined values

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
