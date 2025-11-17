import { describe, it, expect } from 'vitest'
import { createAgent } from '..'
import type { Message } from 'xsai'
import type { Page } from '@chat-tutor/shared'

describe('agent', () => {
  it('should create an agent', async () => {
    const messages: Message[] = []
    const painterMessages: Record<string, Message[]> = {}
    const pages: Page[] = []
    const agent = createAgent({
      apiKey: process.env.API_KEY!,
      baseURL: process.env.BASE_URL!,
      model: process.env.AGENT_MODEL!,
      messages,
      pages,
      painter: {
        apiKey: process.env.API_KEY!,
        baseURL: process.env.BASE_URL!,
        model: process.env.PAINTER_MODEL!,
        messages: painterMessages
      },
    })
    const result = await agent('Hello!', (chunk) => {
      console.log(chunk)
    })
    expect(result.success).toBe(true)
    const snapshot = {
      messages,
      painter_messages: painterMessages,
      pages,
    }
    const id = crypto.randomUUID()
    expect(JSON.stringify(snapshot, null, 2)).toMatchFileSnapshot(`__snapshots__/agent.test.${id}.json`)
  })
})