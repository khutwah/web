export const runtime = 'nodejs'

export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { randomString } from '@/utils/strings'
import { RealtimeInstance } from '@/utils/realtime/instance'
import { EVENT_NAME } from '@/utils/realtime/generic'
import type { GenericStreamPayload } from '@/utils/realtime/types'

export async function GET(
  req: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  const searchParams = req.nextUrl.searchParams
  const params = await paramsPromise
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
        event: EVENT_NAME + ':' + params.id,
        callback: ({ payload }) => {
          const genericPayload = payload as GenericStreamPayload
          try {
            if (
              genericPayload &&
              genericPayload.new?.id !== Number(params.id)
            ) {
              return
            }

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
