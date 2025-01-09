export const runtime = 'nodejs'

export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { randomString } from '@/utils/strings'
import { RealtimeInstance } from '@/utils/realtime/instance'
import { EVENT_NAME } from '@/utils/realtime/generic'

export async function GET(req: NextRequest) {
  await RealtimeInstance.initialize()
  const searchParams = req.nextUrl.searchParams
  const streamId = searchParams.get('stream_id') || randomString()
  const encoder = new TextEncoder()

  const customReadable = new ReadableStream({
    cancel() {
      RealtimeInstance.managerInstance().unregisterCallback(
        EVENT_NAME,
        streamId
      )
    },
    start(controller) {
      RealtimeInstance.managerInstance().registerChannel({
        id: streamId,
        name: EVENT_NAME,
        event: EVENT_NAME,
        callback: ({ payload }) => {
          try {
            controller.enqueue(
              encoder.encode(
                `data: ${typeof payload === 'object' ? JSON.stringify(payload) : 'refresh'}\n\n`
              )
            )
          } catch {}
        }
      })
    }
  })
  return new Response(customReadable, {
    headers: {
      Connection: 'keep-alive',
      'Content-Encoding': 'none',
      'Cache-Control': 'no-cache, no-transform',
      'Content-Type': 'text/event-stream; charset=utf-8'
    }
  })
}
