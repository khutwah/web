import { string, number, object, array, boolean, mixed } from 'yup'
import { testTimestamp } from '../is-valid-date'
import { ActivityStatus } from '@/models/activities'
import { parseComaSeparatedNumbers } from '../validation/is-comma-separated-number'

export const activityFilterSchema = object({
  start_date: string().test(
    'is-valid-date',
    'Tanggal harus dalam format ISO yang valid',
    testTimestamp
  ),
  end_date: string().test(
    'is-valid-date',
    'Tanggal harus dalam format ISO yang valid',
    testTimestamp
  ),
  status: string().oneOf(Object.values(ActivityStatus)),
  type: number().oneOf([1, 2, 3] as const),
  limit: number().integer().min(1),
  offset: number().integer().min(0),
  student_id: number().integer().min(1),
  halaqah_ids: mixed().transform(
    parseComaSeparatedNumbers('Format halaqah_ids harus benar. contoh: 1,2,3')
  ),
  student_attendance: string().oneOf(['present', 'absent'])
})

export const activityCreateSchema = object({
  student_attendance: string()
    .oneOf(['present', 'absent'])
    .required('Kehadiran siswa wajib diisi'),
  notes: string().required('Catatan wajib diisi'),
  tags: array()
    .of(string().required())
    .when('student_attendance', {
      is: 'absent',
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required()
    }),
  shift_id: number().required('ID shift wajib diisi'),
  student_id: number().required('ID siswa wajib diisi'),
  type: number()
    .oneOf(
      [1, 2, 3] as const,
      'Tipe Aktivitas harus salah satu dari 1, 2, atau 3'
    )
    .required('Tipe Aktivitas wajib diisi'),
  status: string()
    .oneOf(
      Object.values(ActivityStatus),
      'Status yang diperbolehkan: draft / completed / deleted'
    )
    .required('Status Aktifitas wajib diisi'),
  achieve_target: boolean()
    .required('Target pencapaian wajib diisi')
    .when('student_attendance', {
      is: 'absent',
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required()
    }),
  start_surah: number()
    .required('Awal baca wajib diisi')
    .when('student_attendance', {
      is: 'absent',
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required()
    }),
  end_surah: number()
    .required('Akhir baca wajib diisi')
    .when('student_attendance', {
      is: 'absent',
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required()
    }),
  start_verse: number()
    .required('Awal ayat wajib diisi')
    .when('student_attendance', {
      is: 'absent',
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required()
    }),
  end_verse: number()
    .required('Akhir ayat wajib diisi')
    .when('student_attendance', {
      is: 'absent',
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required()
    }),
  page_count: number()
    .required('Jumlah halaman wajib diisi')
    .when('student_attendance', {
      is: 'absent',
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required()
    }),
  created_at: string().test(
    'is-valid-date',
    'Tanggal harus dalam format ISO yang valid',
    testTimestamp
  )
})
