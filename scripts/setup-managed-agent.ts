/**
 * ONE-TIME SETUP — run once with `npm run setup:agent`.
 *
 * Creates the Managed Agent + Environment, prints the IDs.
 * Copy the printed IDs into .env as ANTHROPIC_AGENT_ID and ANTHROPIC_ENVIRONMENT_ID.
 *
 * Do NOT call agents.create / environments.create on every request — these are
 * persistent, versioned resources. Re-running this script creates ANOTHER agent.
 * To change the agent's behavior later, use `client.beta.agents.update(...)`.
 */
import Anthropic from '@anthropic-ai/sdk'
import { prismaToolDefinitions } from '../lib/agent-tools'

const SYSTEM_PROMPT = `You are an autonomous research and data agent for a YouTube learning-guide application.

You have three categories of tools:

1. The standard agent toolset (\`agent_toolset_20260401\`): bash, read, write, edit, glob, grep, web_fetch, web_search.
   - Use \`web_search\` and \`web_fetch\` to gather up-to-date information from the web.
   - Use \`bash\` to run shell commands and Python scripts inside your sandbox container for computation, data analysis, and visualization.

2. Custom Prisma tools (executed by the host application, not your sandbox):
   - \`list_courses\`, \`get_course\`, \`search_courses\`: read the courses database.
   - \`create_course\`, \`update_course\`, \`delete_course\`: write to the courses database.
   These tools talk to a PostgreSQL database via Prisma. The \`Course\` model has columns:
     id (uuid), youtube_url, video_title, raw_transcript, structured_chapters (JSON string), created_at, updated_at.

Guidelines:
- Be concise in your final response to the user.
- Confirm destructive operations (delete_course, update_course) by stating the row you're about to change before calling the tool.
- When you need data that is not in the database, fetch it from the web rather than guessing.
- If a tool returns \`{ ok: false, error: ... }\`, acknowledge the error and either retry with corrected input or report it.`

async function main() {
  const client = new Anthropic()

  console.log('Creating environment...')
  const environment = await client.beta.environments.create({
    name: `youtube-guide-agent-env-${Date.now()}`,
    config: {
      type: 'cloud',
      networking: { type: 'unrestricted' },
    },
  })
  console.log(`  ✓ environment_id = ${environment.id}`)

  console.log('Creating agent...')
  const agent = await client.beta.agents.create({
    name: 'YouTube Guide Autonomous Agent',
    model: 'claude-opus-4-7',
    system: SYSTEM_PROMPT,
    tools: [
      { type: 'agent_toolset_20260401', default_config: { enabled: true } },
      ...prismaToolDefinitions,
    ],
  })
  console.log(`  ✓ agent_id    = ${agent.id}`)
  console.log(`  ✓ version     = ${agent.version}`)

  console.log('\nAdd these to your .env:')
  console.log(`ANTHROPIC_AGENT_ID="${agent.id}"`)
  console.log(`ANTHROPIC_ENVIRONMENT_ID="${environment.id}"`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
