import { generateText, message } from 'xsai'
import type { AgentOptions } from './types'

export const getTitle = async (options: AgentOptions, input: string) => {
  const { text } = await generateText({
    model: options.model,
    apiKey: options.apiKey,
    baseURL: options.baseURL,
    messages: [
      message.system(
        `
        You are a helpful assistant that generates a title for a chat.

        You will be given a user input, you **SHOULD ONLY** output the title, no other text.

        The title **MUST LESS THAN 10 WORDS**.
        `.trim()
      ),
      message.user(`User input: "${input}"`),
    ]
  })
  return text
}