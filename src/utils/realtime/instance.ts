/* eslint-disable @typescript-eslint/no-explicit-any */

import { createClient } from '@/utils/supabase/server'
import { RealtimeManager } from '@/utils/realtime/manager'

declare global {
  // eslint-disable-next-line no-var
  var realtimeInstance: Realtime
}

export class Realtime {
  private static instance: Realtime
  private manager: any
  private supabase: any

  private constructor() {}

  public static getInstance(): Realtime {
    if (!Realtime.instance) {
      Realtime.instance = new Realtime()
    }
    return Realtime.instance
  }

  public async initialize() {
    if (this.supabase) {
      return
    }
    this.supabase = await createClient()
    this.manager = new RealtimeManager(this.supabase)
  }

  public managerInstance(): RealtimeManager {
    return this.manager
  }

  public static async broadcast(
    channelName: string,
    event: string,
    payload?: any
  ) {
    await global.realtimeInstance.initialize()
    return global.realtimeInstance
      .managerInstance()
      .broadcast(channelName, event, payload)
  }
}

if (typeof global.realtimeInstance === 'undefined') {
  global.realtimeInstance = Realtime.getInstance()
}

export const RealtimeInstance = global.realtimeInstance
