import { string, number, object, array, boolean } from 'yup'
import { testTimestamp } from '../is-valid-date'

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
  type: number().oneOf([1, 2, 3] as const),
  limit: number().integer().min(1),
  offset: number().integer().min(0)
})

export const activityCreateSchema = object({
  notes: string().required('Catatan wajib diisi'),
  tags: array().of(string()).required('Tag wajib diisi'),
  shift_id: number().required('ID shift wajib diisi'),
  student_id: number().required('ID siswa wajib diisi'),
  type: number()
    .oneOf(
      [1, 2, 3] as const,
      'Tipe Aktivitas harus salah satu dari 1, 2, atau 3'
    )
    .required('Tipe Aktivitas wajib diisi'),
  achieve_target: boolean().required('Target pencapaian wajib diisi'),
  start_surah: number().required('Awal baca wajib diisi'),
  end_surah: number().required('Akhir baca wajib diisi'),
  start_verse: number().required('Awal ayat wajib diisi'),
  end_verse: number().required('Akhir ayat wajib diisi'),
  page_amount: number().required('Jumlah halaman wajib diisi'),
  created_at: string().test(
    'is-valid-date',
    'Tanggal harus dalam format ISO yang valid',
    testTimestamp
  )
})
