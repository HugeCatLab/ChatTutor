import { AgentOptions, AgentInput, convertResources } from './types'
import { streamText } from 'ai'
import { createGateway } from './gateway'
import { createBlockParser } from './utils'
import { agent } from './prompts'

export const createAgent = (options: AgentOptions) => {
  if (options.messages.length === 0) {
    options.messages.push()
  }
  
  return async ({
    prompt, emit, resources, apiKey, baseURL, model, provider
  }: AgentInput) => {
    const gateway = createGateway({
      apiKey,
      baseURL,
      provider,
    })
    const { handle } = createBlockParser({
      pages: options.pages,
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
        ...convertResources(resources || []),
      ]
    })
    console.log('messages', JSON.stringify(options.messages, null, 2))
    const { textStream, response } = streamText({
      model: gateway(model),
      messages: [
        {
          role: 'system', content: agent.system()
        },
        ...options.messages,
      ],
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
  }
}

export * from './title'
export * from './types'
