export interface RoleFilter {
  student_id?: number
  ustadz_id?: number
}

export interface PaginationFilter {
  offset?: number
  limit?: number
}

export interface QueryOptions {
  head?: boolean
  count?: 'exact' | 'planned' | 'estimated'
}
