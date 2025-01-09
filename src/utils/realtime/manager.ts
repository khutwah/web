/* eslint-disable @typescript-eslint/no-explicit-any */

import { RealtimeChannel } from '@supabase/supabase-js'
import type { Channel, Supabase } from './types'

export class RealtimeManager {
  private readonly supabase: any
  private readonly callbacks: Map<string, Channel['callback']> = new Map()
  private readonly channels: Map<string, RealtimeChannel> = new Map()
  private readonly debounceTimers: Map<string, NodeJS.Timeout> = new Map()
  private readonly debounceDelay: number

  constructor(supabase: Supabase, debounceDelay = 300) {
    if (!supabase) {
      throw new Error('Supabase instance is required')
    }
    this.supabase = supabase
    this.debounceDelay = Math.max(0, debounceDelay)
  }

  private debounce(
    key: string,
    callback: (...args: any[]) => void,
    payload: any
  ) {
    // Clear existing timer for this key if it exists.
    if (this.debounceTimers.has(key)) {
      clearTimeout(this.debounceTimers.get(key))
    }

    // Set new timer.
    const timer = setTimeout(() => {
      callback(payload)
      this.debounceTimers.delete(key)
    }, this.debounceDelay)

    this.debounceTimers.set(key, timer)
  }

  registerChannel(channel: Channel) {
    let selectedChannel = this.channels.get(channel.name)
    if (!selectedChannel) {
      selectedChannel = (this.supabase as Supabase).channel(channel.name, {
        config: {
          broadcast: {
            self: true,
            ack: true
          }
        }
      })
      selectedChannel
        .on('broadcast', { event: channel.event as string }, (message) => {
          for (const [key, callback] of this.callbacks.entries()) {
            if (key.startsWith(channel.name)) {
              // Debounce the callback execution.
              this.debounce(key, callback, message)
            }
          }
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED' && selectedChannel) {
            this.channels.set(channel.name, selectedChannel)
          }
        })
    }
    this.registerCallback(channel.name, channel.id, channel.callback)
  }

  async broadcast(channelName: string, event: string, payload?: any) {
    const channel = this.channels.get(channelName)
    if (channel) {
      return channel.send({
        type: 'broadcast',
        event,
        payload
      })
    }
  }

  registerCallback(channelName: string, id: string, callback: any) {
    const callbackId = `${channelName}:${id}`
    if (!this.callbacks.has(callbackId)) {
      this.callbacks.set(callbackId, callback)
    }
  }

  unregisterCallback(channelName: string, id: string) {
    const callbackId = `${channelName}:${id}`
    // Clear any pending debounced callbacks.
    if (this.debounceTimers.has(callbackId)) {
      clearTimeout(this.debounceTimers.get(callbackId))
      this.debounceTimers.delete(callbackId)
    }
    if (this.callbacks.has(callbackId)) {
      this.callbacks.delete(callbackId)
    }
  }
}
