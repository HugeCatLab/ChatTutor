import { AgentOptions, AgentInput } from './types'
import { streamText } from 'ai'
import { createGateway } from './gateway'
import { createBlockParser } from './utils'
import { agent } from './prompts'

export const createAgent = (options: AgentOptions) => {
  console.log(options)
  const gateway = createGateway({
    apiKey: options.apiKey,
    baseURL: options.baseURL,
    provider: options.provider,
  })
  if (options.messages.length === 0) {
    options.messages.push({
      role: 'system', content: agent.system()
    })
  }
  
  return async ({ prompt, emit, images }: AgentInput) => {
    const { handle } = createBlockParser({
      pages: [],
      emit,
      emitText: (chunk) => {
        emit({
          type: 'text',
          options: { text: chunk },
        })
      },
    })
    options.messages.push({
      role: 'user', content: [
        { type: 'text', text: prompt },
        ...(images?.map(image => ({ type: 'image' as const, image: new URL(image) })) || []),
      ]
    })
    const { textStream, response } = streamText({
      model: gateway(options.model),
      messages: options.messages,
    })
    for await (const chunk of textStream) {
      handle({
        type: 'text',
        options: { text: chunk },
      })
    }
    emit({
      type: 'end',
      options: {},
    })
    const messages = (await response).messages
    options.messages.push(...messages)
    console.log(options.messages.length)
  }
}

export * from './title'
export * from './types'
