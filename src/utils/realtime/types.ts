/* eslint-disable @typescript-eslint/no-explicit-any */

import { RealtimeChannel } from '@supabase/supabase-js'

interface Subscription {
  event: string
  schema: string
  table: string
}

export interface Channel {
  id: string
  name: string
  event: Subscription | string
  callback: (message: {
    event: string
    type: 'broadcast'
    payload?: any
  }) => void
}

export interface Sender {
  send: (data: string) => void
}

export interface Supabase {
  channel: (channelName: string, options?: any) => RealtimeChannel
}

export interface GenericStreamPayload {
  new?: {
    id?: number
  }
}
