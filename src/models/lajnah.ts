import Per5JuzLajnah from '@/data/lajnah/per-5-juz-lajnah.json'
import PerSurahLajnah from '@/data/lajnah/per-surah-lajnah.json'
import DefaultLajnah from '@/data/lajnah/default-lajnah.json'

export interface UpsertPayload {
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
  'default' = 'default',
  'per_5_juz_lajnah' = 'per_5_juz_lajnah',
  'surah_kamil_lajnah' = 'surah_kamil_lajnah',
  'custom' = 'custom'
}

interface LajnahTypeOptionsType {
  value: LajnahType
  label: string
}

export const LajnahTypeOptionsType: LajnahTypeOptionsType[] = [
  {
    value: LajnahType.default,
    label: 'Default'
  },
  {
    value: LajnahType.per_5_juz_lajnah,
    label: 'Per 5 Juz Lajnah'
  },
  {
    value: LajnahType.surah_kamil_lajnah,
    label: 'Per Surat'
  },
  {
    value: LajnahType.custom,
    label: 'Tentukan sendiri'
  }
]

export interface FilterPayload {
  parent_lajnah_id?: number | null
  ustadz_id?: number
  student_id?: number
}

export interface ResetPayload {
  parent_lajnah_id: number
  offset_parent_lajnah_id?: number
}

export interface LajnahState {
  id: number
  pageDistance: number
}

export interface MistakeCounterType {
  small: number
  medium: number
  large: number
}

export interface CheckpointType {
  id: string
  timestamp: string
  startSurah: string
  endSurah?: string
  startVerse: number
  endVerse?: number
  mistakes: MistakeCounterType
}

type LajnahTypes = Record<
  LajnahType,
  {
    title: string
    id: {
      type: 'juz' | 'surah'
      label: string
    }
    data: Array<{
      id: number
      checkpoints: {
        start: {
          surah: number
          verse: number
        }
        end: {
          surah: number
          verse: number
        }
      }
    }>
  }
>

export const LAJNAH_TYPES: LajnahTypes = {
  [LajnahType.default]: {
    title: 'Lajnah',
    id: {
      type: 'juz',
      label: 'Juz'
    },
    data: DefaultLajnah
  },
  [LajnahType.per_5_juz_lajnah]: {
    title: 'Lajnah Per 5 Juz',
    id: {
      type: 'juz',
      label: 'Juz'
    },
    data: Per5JuzLajnah
  },
  [LajnahType.surah_kamil_lajnah]: {
    title: 'Lajnah Per Surat',
    id: {
      type: 'surah',
      label: 'Surat'
    },
    data: PerSurahLajnah
  },
  [LajnahType['custom']]: {
    title: 'Lajnah Custom',
    id: {
      type: 'surah',
      label: 'Surat'
    },
    data: []
  }
}
