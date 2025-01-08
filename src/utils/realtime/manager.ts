/* eslint-disable @typescript-eslint/no-explicit-any */

import { createClient } from '@/utils/supabase/server'
import { RealtimeChannel } from '@supabase/supabase-js'
import type { Channel } from './types'

export default class SubscriptionManager {
  private static instance: SubscriptionManager

  private callbacks: Map<string, any> = new Map()
  private channels: Map<string, RealtimeChannel> = new Map()
  private supabase: any

  private constructor() {}

  public static async initialize(): Promise<SubscriptionManager> {
    const instance = SubscriptionManager.getInstance()
    await instance.initializeSubscriptions()
    return instance
  }

  private async initializeSubscriptions() {
    if (!this.supabase) {
      this.supabase = await createClient()
    }
  }

  public static getChannel(channelName: string) {
    const instance = SubscriptionManager.getInstance()
    return instance.channels.get(channelName)
  }

  public static registerChannel(
    channel: Channel,
    onEvent: 'postgres_changes' | 'broadcast' = 'postgres_changes'
  ) {
    const instance = SubscriptionManager.getInstance()
    let selectedChannel = instance.channels.get(channel.name)
    if (!selectedChannel) {
      instance.registerCallback(channel.name, channel.id, channel.callback)
      selectedChannel = instance.supabase
        .channel(channel.name)
        .on(onEvent, channel.event, (payload: any) => {
          for (const [key, callback] of instance.callbacks.entries()) {
            if (key.startsWith(channel.name)) {
              callback(payload)
            }
          }
        })

      if (selectedChannel) {
        selectedChannel.subscribe() // TODO(dio): Logging.
        instance.channels.set(channel.name, selectedChannel)
      } else {
        throw new Error(`Failed to register channel: ${channel.name}`)
      }
    }
    instance.registerCallback(channel.name, channel.id, channel.callback)
  }

  public static unregisterCallback(channelName: string, id: string) {
    const instance = SubscriptionManager.getInstance()
    const callbackId = `${channelName}:${id}`
    if (instance.callbacks.has(callbackId)) {
      instance.callbacks.delete(callbackId)
    }
  }

  private registerCallback(channelName: string, id: string, callback: any) {
    const callbackId = `${channelName}:${id}`
    if (!this.callbacks.has(callbackId)) {
      this.callbacks.set(callbackId, callback)
    }
  }

  public static getInstance(): SubscriptionManager {
    if (!SubscriptionManager.instance) {
      SubscriptionManager.instance = new SubscriptionManager()
    }

    return SubscriptionManager.instance
  }
}
