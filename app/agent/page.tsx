import AgentChat from '@/components/AgentChat'

export const metadata = {
  title: 'Autonomous Agent',
}

export default function AgentPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-2 text-2xl font-semibold">Autonomous Agent</h1>
      <p className="mb-6 text-sm text-gray-600">
        Powered by Claude Managed Agents. Tools available: web search, web fetch,
        bash / code execution (sandboxed), and read/write access to the Course
        database via Prisma.
      </p>
      <AgentChat />
    </main>
  )
}
