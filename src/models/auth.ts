export const MUMTAZ_AUTH_API = 'https://mumtaz.khutwah.id/auth/oauth/login'

export const ROLE = {
  STUDENT: 1,
  USTADZ: 2,
  LAJNAH: 3
}

export const IDENTIFIER_BY_ROLE = {
  [ROLE.STUDENT]: 'student_id',
  [ROLE.USTADZ]: 'ustadz_id',
  [ROLE.LAJNAH]: 'ustadz_id' // A Lajnah member is also an ustadz.
}

export const PAGE_BY_ROLE = {
  [ROLE.STUDENT]: '/santri',
  [ROLE.USTADZ]: '/ustadz',
  [ROLE.LAJNAH]: '/ustadz'
}

export const DEFAULT_EMAIL_DOMAIN = 'app.minhajulhaq.sch.id'

export const TEMPORARY_PIN_PAGE_ID_COOKIE = '_sbex2'
export const PIN_IS_SUBMMITTED = '_pin'
