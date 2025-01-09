/* eslint-disable @typescript-eslint/no-explicit-any */

import { RealtimeChannel } from '@supabase/supabase-js'
import type { Channel, Supabase } from './types'

export class RealtimeManager {
  private readonly supabase: any
  private readonly callbacks: Map<string, Channel['callback']> = new Map()
  private readonly channels: Map<string, RealtimeChannel> = new Map()
  private readonly timers: Map<string, NodeJS.Timeout> = new Map()
  private readonly queues: Map<string, any[]> = new Map()
  private readonly delay: number

  constructor(supabase: Supabase, delay = 300) {
    if (!supabase) {
      throw new Error('Supabase instance is required')
    }
    this.supabase = supabase
    this.delay = Math.max(0, delay)
  }

  private queueAndCoalesce(
    key: string,
    callback: (...args: any[]) => void,
    payload: any
  ) {
    if (!this.queues.has(key)) {
      this.queues.set(key, [])
    }

    this.queues.get(key)?.push(payload)

    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key))
    }

    const timer = setTimeout(() => {
      const queue = this.queues.get(key) || []
      callback(queue)
      this.queues.delete(key)
      this.timers.delete(key)
    }, this.delay)

    this.timers.set(key, timer)
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
              this.queueAndCoalesce(key, callback, message)
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
    if (this.timers.has(callbackId)) {
      clearTimeout(this.timers.get(callbackId))
      this.timers.delete(callbackId)
    }
    if (this.queues.has(callbackId)) {
      this.queues.delete(callbackId)
    }
    if (this.callbacks.has(callbackId)) {
      this.callbacks.delete(callbackId)
    }
  }
}
