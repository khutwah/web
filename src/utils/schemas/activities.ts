import { string, number, object, array, boolean, mixed } from 'yup'
import { testTimestamp } from '../is-valid-date'
import { ActivityStatus } from '@/models/activities'
import { parseComaSeparatedNumbers } from '../is-comma-separated-number'

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
  circle_ids: mixed().transform(
    parseComaSeparatedNumbers('Format circle_ids harus benar. contoh: 1,2,3')
  ),
  student_attendance: string().oneOf(['present', 'absent'])
})

const whenNotRequired = (
  student_attendance: string,
  status: ActivityStatus
) => {
  return student_attendance === 'absent' || status === ActivityStatus.draft
}

export const activityCreateSchema = object({
  student_attendance: string()
    .oneOf(['present', 'absent'])
    .required('Kehadiran siswa wajib diisi'),
  notes: string().notRequired(),
  tags: array().of(string().required('Penanda wajib diisi')).notRequired(),
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
  is_target_achieved: boolean()
    .required('Target pencapaian wajib diisi')
    .when(['student_attendance', 'status'], {
      is: whenNotRequired,
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required('Target pencapaian wajib diisi')
    }),
  start_surah: number()
    .required('Awal baca wajib diisi')
    .when('student_attendance', {
      is: 'absent',
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required('Awal baca wajib diisi')
    })
    .nullable(),
  end_surah: number()
    .required('Akhir baca wajib diisi')
    .when(['student_attendance', 'status'], {
      is: whenNotRequired,
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required('Akhir baca wajib diisi')
    })
    .nullable(),
  start_verse: number()
    .required('Awal ayat wajib diisi')
    .when('student_attendance', {
      is: 'absent',
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required('Awal ayat wajib diisi')
    })
    .nullable(),
  end_verse: number()
    .required('Akhir ayat wajib diisi')
    .when(['student_attendance', 'status'], {
      is: whenNotRequired,
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required('Akhir ayat wajib diisi')
    })
    .nullable(),
  page_count: number()
    .required('Jumlah halaman wajib diisi')
    .when(['student_attendance', 'status'], {
      is: whenNotRequired,
      then: (schema) => schema.notRequired(),
      otherwise: (schema) =>
        schema
          .required('Jumlah halaman wajib diisi')
          .min(0.5, 'Jumlah halaman minimal 0.5')
    })
    .nullable(),
  target_page_count: number().required('Target Jumlah halaman wajib diisi'),
  created_at: string().test(
    'is-valid-date',
    'Tanggal harus dalam format ISO yang valid',
    testTimestamp
  )
})
