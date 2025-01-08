export const runtime = 'nodejs'

export const dynamic = 'force-dynamic'

import { createClient } from '@/utils/supabase/server'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const studentId = searchParams.get('student_id')
  const encoder = new TextEncoder()
  const supabase = await createClient()
  let isStreamOpen = true

  const customReadable = new ReadableStream({
    cancel() {
      isStreamOpen = false
      supabase.channel('checkpoints-update').unsubscribe()
      supabase.channel('checkpoints-insert').unsubscribe()
    },
    start(controller) {
      supabase
        .channel('checkpoints-insert')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'checkpoints'
          },
          (payload) => {
            if (studentId && payload['new'].student_id !== Number(studentId)) {
              return
            }
            try {
              if (isStreamOpen) {
                controller.enqueue(encoder.encode(`data: refresh\n\n`))
              }
            } catch {}
          }
        )
        .subscribe()

      supabase
        .channel('checkpoints-update')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'checkpoints'
          },
          (payload) => {
            if (studentId && payload['new'].student_id !== Number(studentId)) {
              return
            }

            // FIXME: uncaughtException: TypeError: Invalid state: Controller is already closed is thrown here.
            try {
              if (isStreamOpen) {
                controller.enqueue(encoder.encode(`data: refresh\n\n`))
              }
            } catch {}
          }
        )
        .subscribe()
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
