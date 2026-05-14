'use client'

import { useRef, useState } from 'react'

type LogEntry = {
  id: string
  label: string
  detail?: string
  tone: 'agent' | 'tool' | 'status' | 'user' | 'error'
}

function describeEvent(ev: any): LogEntry | null {
  const id = ev?.id ?? `${ev?.type}-${Date.now()}-${Math.random()}`
  switch (ev?.type) {
    case 'user.message': {
      const text = ev.content?.find((c: any) => c.type === 'text')?.text ?? ''
      return { id, label: 'You', detail: text, tone: 'user' }
    }
    case 'agent.message': {
      const text = ev.content?.find((c: any) => c.type === 'text')?.text ?? ''
      return text ? { id, label: 'Agent', detail: text, tone: 'agent' } : null
    }
    case 'agent.thinking':
      return { id, label: 'Thinking', detail: '…', tone: 'status' }
    case 'agent.tool_use':
      return { id, label: `Tool: ${ev.name}`, detail: JSON.stringify(ev.input), tone: 'tool' }
    case 'agent.custom_tool_use':
      return {
        id,
        label: `DB tool: ${ev.name}`,
        detail: JSON.stringify(ev.input),
        tone: 'tool',
      }
    case 'agent.tool_result':
      return { id, label: 'Tool result', tone: 'tool' }
    case 'session.status_running':
      return { id, label: 'Agent running…', tone: 'status' }
    case 'session.status_idle':
      return {
        id,
        label: 'Agent idle',
        detail: ev.stop_reason?.type,
        tone: 'status',
      }
    case 'session.status_terminated':
      return { id, label: 'Session terminated', tone: 'status' }
    case 'session.error':
      return { id, label: 'Error', detail: ev.error?.message, tone: 'error' }
    default:
      return null
  }
}

export default function AgentChat() {
  const [input, setInput] = useState('')
  const [log, setLog] = useState<LogEntry[]>([])
  const [running, setRunning] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (running || !input.trim()) return
    const message = input.trim()
    setInput('')
    setLog((l) => [
      ...l,
      { id: `u-${Date.now()}`, label: 'You', detail: message, tone: 'user' },
    ])
    setRunning(true)

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
        signal: controller.signal,
      })
      if (!res.ok || !res.body) {
        const text = await res.text().catch(() => '')
        throw new Error(`HTTP ${res.status}: ${text}`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop() ?? ''
        for (const chunk of lines) {
          const line = chunk.trim()
          if (!line.startsWith('data:')) continue
          const json = line.slice(5).trim()
          if (!json) continue
          try {
            const { kind, payload } = JSON.parse(json)
            if (kind === 'event') {
              const entry = describeEvent(payload)
              if (entry) setLog((l) => [...l, entry])
            } else if (kind === 'session') {
              setLog((l) => [
                ...l,
                {
                  id: `s-${payload.id}`,
                  label: 'Session created',
                  detail: payload.id,
                  tone: 'status',
                },
              ])
            } else if (kind === 'error') {
              setLog((l) => [
                ...l,
                {
                  id: `e-${Date.now()}`,
                  label: 'Server error',
                  detail: payload.message,
                  tone: 'error',
                },
              ])
            }
          } catch {
            // ignore non-JSON keepalives
          }
        }
      }
    } catch (err) {
      setLog((l) => [
        ...l,
        {
          id: `e-${Date.now()}`,
          label: 'Client error',
          detail: err instanceof Error ? err.message : String(err),
          tone: 'error',
        },
      ])
    } finally {
      setRunning(false)
      abortRef.current = null
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded border border-gray-200 bg-white p-4 min-h-[400px] max-h-[600px] overflow-y-auto space-y-2 text-sm">
        {log.length === 0 && (
          <div className="text-gray-400">
            Ask the agent something — e.g. &quot;List my courses&quot; or
            &quot;Search the web for the latest Next.js 15 features&quot;.
          </div>
        )}
        {log.map((entry) => (
          <div
            key={entry.id}
            className={
              entry.tone === 'user'
                ? 'border-l-4 border-blue-500 pl-3'
                : entry.tone === 'agent'
                ? 'border-l-4 border-green-500 pl-3'
                : entry.tone === 'tool'
                ? 'border-l-4 border-amber-500 pl-3 text-gray-700'
                : entry.tone === 'error'
                ? 'border-l-4 border-red-500 pl-3 text-red-700'
                : 'border-l-4 border-gray-300 pl-3 text-gray-500'
            }
          >
            <div className="font-medium">{entry.label}</div>
            {entry.detail && (
              <div className="whitespace-pre-wrap break-words">{entry.detail}</div>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={submit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={running ? 'Agent is working…' : 'Type a request…'}
          disabled={running}
          className="flex-1 rounded border border-gray-300 px-3 py-2"
        />
        <button
          type="submit"
          disabled={running || !input.trim()}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:bg-gray-400"
        >
          {running ? 'Running…' : 'Send'}
        </button>
      </form>
    </div>
  )
}
