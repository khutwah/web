export const MUMTAZ_AUTH_API = 'https://app.minhajulhaq.sch.id/auth/oauth/login'

export const ROLE = {
  STUDENT: 1,
  USTADZ: 2
}

export const IDENTIFIER_BY_ROLE = {
  [ROLE.STUDENT]: 'student_id',
  [ROLE.USTADZ]: 'ustadz_id'
}

export const PAGE_BY_ROLE = {
  [ROLE.STUDENT]: '/santri',
  [ROLE.USTADZ]: '/ustadz'
}

export const DEFAULT_EMAIL_DOMAIN = 'app.minhajulhaq.sch.id'

export const TEMPORARY_PIN_PAGE_ID_COOKIE = '_sbex2'
