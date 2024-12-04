import { ActivityType } from './activities'

export interface FormProps {
  activityType: ActivityType
  shiftId: number
  studentId: number
  santriPageUri: string
  lastSurah?: number
  lastVerse?: number
}
