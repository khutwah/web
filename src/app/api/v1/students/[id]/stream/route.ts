export const runtime = 'nodejs'

export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { randomString } from '@/utils/strings'
import { RealtimeInstance } from '@/utils/realtime/instance'

export async function GET(
  req: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  await RealtimeInstance.initialize()
  const params = await paramsPromise
  const searchParams = req.nextUrl.searchParams
  const studentId = params.id
  const streamId = searchParams.get('stream_id') || randomString()
  const encoder = new TextEncoder()

  const customReadable = new ReadableStream({
    cancel() {
      RealtimeInstance.managerInstance().unregisterCallback(
        'student-update',
        streamId
      )
    },
    start(controller) {
      RealtimeInstance.managerInstance().registerChannel({
        id: streamId,
        name: 'student-update',
        event: `student-update:${studentId}`,
        callback: ({ payload }) => {
          if (
            payload &&
            payload['new'] &&
            payload['new'].student_id !== Number(studentId)
          ) {
            return
          }
          try {
            controller.enqueue(encoder.encode(`data: refresh\n\n`))
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
