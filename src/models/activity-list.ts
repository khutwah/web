import { ActivityEntry } from './activities'

export interface ActivityListProps extends FilterProps {}
export interface ActivityListClientProps extends FilterProps {
  initialActivities: Array<ActivityEntry>
  tz: string
}

export const LIMIT = 10

export interface FilterProps {
  studentId?: number
}

export interface GetActivitiesArgs {
  offset: number
  limit: number
  filter?: FilterProps
}

export interface AktivitasPageProps {
  searchParams: Promise<{
    student_id?: number
  }>
}
