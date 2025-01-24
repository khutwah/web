import DefaultRanges from '@/data/assessments/ranges/default.json'
import PerJuzRanges from '@/data/assessments/ranges/per-juz.json'
import PerSurahRanges from '@/data/assessments/ranges/per-surah.json'

import { Json } from '@/models/database.types'

export interface UpsertPayload {
  student_id: number
  ustadz_id: number
  start_date: string
  end_date?: string
  session_type?: string
  session_name?: string
  surah_range?: Json | undefined
  notes?: string
  low_mistake_count?: number
  medium_mistake_count?: number
  high_mistake_count?: number
  parent_assessment_id?: number
  final_mark?: string
  created_at?: string
  updated_at?: string
}

export enum AssessmentFinalMark {
  Mumtaz = 'Mumtaz',
  'Jayyid Jiddan' = 'Jayyid Jiddan',
  Jayyid = 'Jayyid',
  Maqbul = 'Maqbul'
}

export enum AssessmentType {
  'lajnah' = 'lajnah',
  'per_juz' = 'per_juz',
  'per_surah' = 'per_surah',
  'custom' = 'custom'
}

interface AssessmentTypeOptionType {
  value: AssessmentType
  label: string
}

export const AssessmentTypeOptions: AssessmentTypeOptionType[] = [
  {
    value: AssessmentType.lajnah,
    label: 'Lajnah'
  },
  {
    value: AssessmentType.per_juz,
    label: 'Per Juz'
  },
  {
    value: AssessmentType.per_surah,
    label: 'Per Surat'
  },
  {
    value: AssessmentType.custom,
    label: 'Pilihan Sendiri'
  }
]

export interface FilterPayload {
  parent_assessment_id?: number | null
  ustadz_id?: number
  student_id?: number
  limit?: number
}

export interface ResetPayload {
  parent_assessment_id: number
  offset_parent_assessment_id?: number
}

export interface AssessmentRange {
  start: {
    juz?: number
    surah: number
    verse: number
  }
  end: {
    juz?: number
    surah: number
    verse: number
  }
}

type AssessmentTypes = Record<
  AssessmentType,
  {
    title: string
    id: {
      type: 'juz' | 'surah'
      label: string
    }
    data: Array<{
      id: number
      ranges: AssessmentRange[]
    }>
  }
>

export const ASSESSMENT_TYPES: AssessmentTypes = {
  [AssessmentType.lajnah]: {
    title: 'Lajnah',
    id: {
      type: 'juz',
      label: 'Materi'
    },
    data: DefaultRanges
  },
  [AssessmentType.per_juz]: {
    title: 'Per Juz',
    id: {
      type: 'juz',
      label: 'Materi'
    },
    data: PerJuzRanges
  },
  [AssessmentType.per_surah]: {
    title: 'Per Surat',
    id: {
      type: 'surah',
      label: 'Surat'
    },
    data: PerSurahRanges
  },
  [AssessmentType['custom']]: {
    title: 'Custom',
    id: {
      type: 'surah',
      label: 'Surat'
    },
    data: []
  }
}

export const ASSESSMENT_MARKS = [
  {
    value: AssessmentFinalMark.Mumtaz,
    label: 'Mumtaz'
  },
  {
    value: AssessmentFinalMark['Jayyid Jiddan'],
    label: 'Jayyid Jiddan'
  },
  {
    value: AssessmentFinalMark.Jayyid,
    label: 'Jayyid'
  },
  {
    value: AssessmentFinalMark.Maqbul,
    label: 'Maqbul'
  }
]

export interface MistakeCounterType {
  low: number
  medium: number
  high: number
}

export interface AssessmentCheckpointType {
  id: number
  timestamp: string
  startSurah: string
  endSurah?: string
  startVerse: number
  endVerse?: number
  mistakes: MistakeCounterType
  notes?: string | null
}
