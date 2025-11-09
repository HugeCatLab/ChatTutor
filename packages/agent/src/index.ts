import { message, streamText } from 'xsai'
import { agent } from './prompts'
import { getAgentTools } from './tools'
import type { Action, FullAction, Page } from '@chat-tutor/shared'
import type { ReadableStream } from 'node:stream/web'
import type { AgentChunker, BaseAgentOptions } from './types'

export type TextChunkAction = Action<{ chunk: string }, 'text'>
export type PageCreationAction<T extends Page = Page> = Action<T, 'page'>
export type PageNoteAction = FullAction<{ content: string }, 'note'>

export interface AgentOptions extends BaseAgentOptions {
  pages: Page[]
  painter: BaseAgentOptions
}

export const createAgent = (options: AgentOptions) => {
  if (options.messages.length === 0 || options.messages[0].role !== 'system') {
    options.messages.unshift(
      message.system(agent.system())
    )
  }

  type AdditionalInput = {
    images?: string[]
  }
   
  return async (
    input: string,
    chunker: AgentChunker,
    { images }: AdditionalInput = {}
  ) => {
    const tools = (await Promise.all([
      getAgentTools({
        pages: options.pages,
        painterOptions: options.painter,
        chunker,
      }),
    ])).flat()
    options.messages.push(message.user(
      [message.textPart(input), ...(images ?? []).map(i => message.imagePart(i))]
    ))
    const { textStream, messages } = streamText({
      model: options.model,
      apiKey: options.apiKey,
      baseURL: options.baseURL,
      messages: options.messages,
      tools,
      maxSteps: 15,
    })
    messages.then(ms => {
      options.messages.length = 0
      options.messages.push(...ms)
    })
    for await (const chunk of <ReadableStream<string>>textStream) {
      chunker({
        type: 'text',
        options: { chunk },
      } as TextChunkAction)
    }
    return {
      success: true,
      message: 'Agent completed',
    }
  }
}

export * from './tools'
export * from './painter'
export * from './types'
