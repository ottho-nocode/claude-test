import { NextRequest } from 'next/server'
import { anthropic, AGENT_ID, ENVIRONMENT_ID } from '@/lib/anthropic'
import { runPrismaTool } from '@/lib/agent-tools'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function POST(req: NextRequest) {
  if (!AGENT_ID || !ENVIRONMENT_ID) {
    return new Response(
      JSON.stringify({
        error:
          'Managed agent not configured. Run `npm run setup:agent` and set ANTHROPIC_AGENT_ID + ANTHROPIC_ENVIRONMENT_ID.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const body = (await req.json().catch(() => ({}))) as { message?: string }
  const userMessage = (body.message ?? '').trim()
  if (!userMessage) {
    return new Response(JSON.stringify({ error: 'Missing "message" in body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const encoder = new TextEncoder()

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (kind: string, payload: unknown) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ kind, payload })}\n\n`)
        )
      }

      let sessionId: string | null = null

      try {
        const session = await anthropic.beta.sessions.create({
          agent: AGENT_ID,
          environment_id: ENVIRONMENT_ID,
          title: userMessage.slice(0, 80),
        } as any)
        sessionId = (session as any).id as string
        send('session', { id: sessionId })

        // Stream-first, then send the kickoff message (Pattern 7).
        const eventStream = await anthropic.beta.sessions.events.stream(sessionId)

        await anthropic.beta.sessions.events.send(sessionId, {
          events: [
            {
              type: 'user.message',
              content: [{ type: 'text', text: userMessage }],
            },
          ],
        } as any)

        for await (const event of eventStream as AsyncIterable<any>) {
          // Mirror every event to the browser.
          send('event', event)

          // Pattern 9: handle host-side custom tools (Prisma).
          if (event.type === 'agent.custom_tool_use') {
            const result = await runPrismaTool(event.name, event.input)
            const text = JSON.stringify(result)
            await anthropic.beta.sessions.events.send(sessionId, {
              events: [
                {
                  type: 'user.custom_tool_result',
                  custom_tool_use_id: event.id,
                  content: [{ type: 'text', text }],
                  is_error: !result.ok,
                },
              ],
            } as any)
            continue
          }

          // Idle-break gate (Pattern 5).
          if (event.type === 'session.status_idle') {
            if (event.stop_reason?.type === 'requires_action') continue
            break
          }
          if (event.type === 'session.status_terminated') break
        }

        send('done', { sessionId })
      } catch (err) {
        send('error', { message: err instanceof Error ? err.message : String(err) })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
