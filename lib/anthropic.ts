import Anthropic from '@anthropic-ai/sdk'

const globalForAnthropic = globalThis as unknown as {
  anthropic: Anthropic | undefined
}

export const anthropic = globalForAnthropic.anthropic ?? new Anthropic()

if (process.env.NODE_ENV !== 'production') globalForAnthropic.anthropic = anthropic

export const AGENT_ID = process.env.ANTHROPIC_AGENT_ID ?? ''
export const ENVIRONMENT_ID = process.env.ANTHROPIC_ENVIRONMENT_ID ?? ''
