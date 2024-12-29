import Per5JuzLajnah from '@/data/lajnah/per-5-juz-lajnah.json'
import PerSurahLajnah from '@/data/lajnah/per-surah-lajnah.json'
import DefaultLajnah from '@/data/lajnah/default-lajnah.json'

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
  'Jayyid Jiddan' = 'jayyid jiddan',
  Jayyid = 'Jayyid',
  Maqbul = 'Maqbul'
}

export enum AssessmentType {
  'default' = 'default',
  'per_5_juz' = 'per_5_juz',
  'per_surah' = 'per_surah',
  'custom' = 'custom'
}

interface AssessmentTypeOptionsType {
  value: AssessmentType
  label: string
}

export const AssessmentTypeOptionsType: AssessmentTypeOptionsType[] = [
  {
    value: AssessmentType.default,
    label: 'Default'
  },
  {
    value: AssessmentType.per_5_juz,
    label: 'Per 5 Juz'
  },
  {
    value: AssessmentType.per_surah,
    label: 'Per Surat'
  },
  {
    value: AssessmentType.custom,
    label: 'Tentukan sendiri'
  }
]

export interface FilterPayload {
  parent_assessment_id?: number | null
  ustadz_id?: number
  student_id?: number
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
      ranges: AssessmentRange | AssessmentRange[]
    }>
  }
>

export const ASSESSMENT_TYPES: AssessmentTypes = {
  [AssessmentType.default]: {
    title: 'Asesmen Lajnah',
    id: {
      type: 'juz',
      label: 'Juz'
    },
    data: DefaultLajnah
  },
  [AssessmentType.per_5_juz]: {
    title: 'Asesmen Per 5 Juz',
    id: {
      type: 'juz',
      label: 'Juz'
    },
    data: Per5JuzLajnah
  },
  [AssessmentType.per_surah]: {
    title: 'Asesmen Per Surat',
    id: {
      type: 'surah',
      label: 'Surat'
    },
    data: PerSurahLajnah
  },
  [AssessmentType['custom']]: {
    title: 'Asesmen Custom',
    id: {
      type: 'surah',
      label: 'Surat'
    },
    data: []
  }
}

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
}
