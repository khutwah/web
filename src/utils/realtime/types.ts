/* eslint-disable @typescript-eslint/no-explicit-any */

interface Subscription {
  event: string
  schema: string
  table: string
}

export interface Channel {
  id: string
  name: string
  event: Subscription
  callback: (payload: any) => void
}
