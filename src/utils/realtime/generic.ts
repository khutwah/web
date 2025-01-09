import { Realtime } from './instance'

export const EVENT_NAME = 'generic-refresh'

export async function broadcast(id?: number) {
  return Realtime.broadcast(
    EVENT_NAME,
    EVENT_NAME,
    id
      ? {
          new: { id }
        }
      : undefined
  )
}
