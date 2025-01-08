export const runtime = 'nodejs'

export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { initializeSubscriptionManager } from '@/utils/realtime/instance'
import SubscriptionManager from '@/utils/realtime/manager'
import { randomString } from '@/utils/strings'

export async function GET(req: NextRequest) {
  await initializeSubscriptionManager()

  const searchParams = req.nextUrl.searchParams
  const studentId = searchParams.get('student_id')
  const streamId = searchParams.get('stream_id') || randomString()
  const encoder = new TextEncoder()

  const customReadable = new ReadableStream({
    cancel() {
      SubscriptionManager.unregisterCallback('checkpoints-insert', streamId)
      SubscriptionManager.unregisterCallback('checkpoints-update', streamId)
    },
    start(controller) {
      SubscriptionManager.registerChannel({
        id: streamId,
        name: 'checkpoints-insert',
        event: {
          event: 'INSERT',
          schema: 'public',
          table: 'checkpoints'
        },
        callback: (payload) => {
          if (studentId && payload['new'].student_id !== Number(studentId)) {
            return
          }
          try {
            controller.enqueue(encoder.encode(`data: refresh\n\n`))
          } catch {}
        }
      })

      SubscriptionManager.registerChannel({
        id: streamId,
        name: 'checkpoints-update',
        event: {
          event: 'UPDATE',
          schema: 'public',
          table: 'checkpoints'
        },
        callback: (payload) => {
          if (studentId && payload['new'].student_id !== Number(studentId)) {
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
