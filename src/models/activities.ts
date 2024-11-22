export enum ActivityType {
  Sabaq = 1,
  Sabqi = 2,
  Manzil = 3
}

export type ActivityTypeKey = keyof typeof ActivityType

export enum ActivityStatus {
  draft = 'draft',
  completed = 'completed',
  deleted = 'deleted'
}
