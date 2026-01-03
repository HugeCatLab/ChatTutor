import { generateText } from 'ai'
import type { AgentProvider } from './types'
import { createGateway } from './gateway'

export const getTitle = async (options: {
  apiKey: string
  baseURL: string
  model: string
  provider: AgentProvider
}, input: string) => {
  const gateway = createGateway({
    apiKey: options.apiKey,
    baseURL: options.baseURL,
    provider: options.provider,
  })
  const { text } = await generateText({
    model: gateway(options.model),
    messages: [
      {
        role: 'system', content: `
        You are a helpful assistant that generates a title for a chat.

        You will be given a user input, you **SHOULD ONLY** output the title, no other text.

        The title **MUST LESS THAN 10 WORDS**.
        `.trim()
      },
      {
        role: 'user', content: input,
      },
    ],
  })
  return text
}