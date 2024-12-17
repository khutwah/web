export interface InsertPayload {
  student_id: number
  ustadz_id: number
  start_date: string
  end_date?: string
  session_type?: string
  session_name?: string
  start_surah?: number
  start_verse?: number
  end_surah?: number
  end_verse?: number
  notes?: string
  low_mistake_count?: number
  medium_mistake_count?: number
  high_mistake_count?: number
  parent_lajnah_id?: number
  final_mark?: string
  created_at?: string
  updated_at?: string
}

export enum LajnahFinalMark {
  Mumtaz = 'Mumtaz',
  'Jayyid Jiddan' = 'jayyid jiddan',
  Jayyid = 'Jayyid',
  Maqbul = 'Maqbul'
}

export enum LajnahType {
  'per_5_juz_lajnah' = 'per_5_juz_lajnah',
  'surah_kamil_jannah' = 'surah_kamil_jannah',
  'custom' = 'custom'
}
