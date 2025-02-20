/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@supabase/supabase-js'
import { RealtimeManager } from '@/utils/realtime/manager'

declare global {
  // eslint-disable-next-line no-var
  var realtimeInstance: Realtime
}

// This is to make ladle works. Do not remove.
const isBrowser = typeof window !== 'undefined'
const globalObject = isBrowser ? window : global

export class Realtime {
  private manager: any
  private supabase: any

  private constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_API_URL || 'https://api.supabase.co',
      process.env.SUPABASE_ANON_KEY || 'key'
    )
    this.manager = new RealtimeManager(this.supabase)
  }

  public static getInstance(): Realtime {
    if (!globalObject.realtimeInstance) {
      globalObject.realtimeInstance = new Realtime()
    }
    return globalObject.realtimeInstance
  }

  public managerInstance(): RealtimeManager {
    return this.manager
  }

  public static async broadcast(
    channelName: string,
    event: string,
    payload?: any
  ) {
    return Realtime.getInstance()
      .managerInstance()
      .broadcast(channelName, event, payload)
  }
}

if (typeof globalObject.realtimeInstance === 'undefined') {
  globalObject.realtimeInstance = Realtime.getInstance()
}

export const RealtimeInstance = globalObject.realtimeInstance
