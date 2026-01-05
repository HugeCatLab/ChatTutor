import { AgentOptions, AgentInput, convertResources, AgentEmitter } from './types'
import { streamText, LanguageModel, ModelMessage } from 'ai'
import { createGateway } from './gateway'
import { createBlockParser } from './utils'
import { agent } from './prompts'
import { Page } from '@chat-tutor/shared'

const setupParser = (pages: Page[], emit: AgentEmitter) => {
  return createBlockParser({
    pages,
    emit,
    emitText: (chunk) => {
      emit({
        type: 'text',
        options: { text: chunk },
      })
    },
  })
}

const appendUserMessage = (messages: any[], prompt: string, resources: any[] = []) => {
  messages.push({
    role: 'user', 
    content: [
      { type: 'text', text: prompt },
      ...convertResources(resources || []),
    ]
  })
}

const createStream = (model: LanguageModel, messages: any[], signal?: AbortSignal) => {
  return streamText({
    model,
    abortSignal: signal,
    messages: [
      {
        role: 'system', 
        content: agent.system()
      },
      ...messages,
    ] as ModelMessage[],
  })
}

export const createAgent = (options: AgentOptions) => {
  return async ({
    prompt, emit, resources, apiKey, baseURL, model: modelName, provider, signal
  }: AgentInput) => {
    // 1. Initialize Gateway
    const gateway = createGateway({
      apiKey,
      baseURL,
      provider,
    })
    
    // 2. Setup Parser
    const { handle } = setupParser(options.pages, emit)
    
    // 3. Prepare Messages
    appendUserMessage(options.messages, prompt, resources)
    console.log('messages', JSON.stringify(options.messages, null, 2))
    
    // 4. Execute Stream
    const { textStream } = createStream(
      gateway(modelName),
      options.messages,
      signal
    )
  
    // 使用fullText保存完整文本, 避免中止后无法从response中获取完整文本
    let fullText = ''

    // 5. Handle Stream
    try {
      for await (const chunk of textStream) {
        fullText += chunk
        handle({
          type: 'text',
          options: { text: chunk },
        })
      }
      
      // 6. Finish
      emit({
        type: 'end',
        options: {},
      })
    } finally {
      // 7. Update History
      if (fullText) {
        options.messages.push({
          role: 'assistant',
          content: fullText,
        })
      }
    }
  }
}

export * from './title'
export * from './types'
