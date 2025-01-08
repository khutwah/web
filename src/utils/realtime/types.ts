/* eslint-disable @typescript-eslint/no-explicit-any */

import { RealtimeChannelSendResponse } from '@supabase/supabase-js'

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

export interface Sender {
  send: (data: string) => void
}
