import { ActivityEntry } from './activities'

export interface ActivityListProps extends FilterProps {}
export interface ActivityListClientProps extends FilterProps {
  initialActivities: Array<ActivityEntry>
}

export const LIMIT = 10

export interface FilterProps {
  studentId?: number
}
