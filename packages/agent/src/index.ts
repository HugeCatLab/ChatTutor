import { message, streamText, type Message } from 'xsai'
import { agent } from './prompts'
import { getAgentTools } from './tools'
import type { Action, FullAction, Page } from '@chat-tutor/shared'
import type { ReadableStream } from 'node:stream/web'
import type { AgentChunker, BaseAgentOptions } from './types'
import { createBlockParser } from '../utils/blockParser'

export type TextChunkAction = Action<{ chunk: string }, 'text'>
export type PageCreationAction<T extends Page = Page> = Action<T, 'page'>
export type PageNoteAction = FullAction<{ content: string }, 'note'>

export interface AgentOptions extends BaseAgentOptions {
  pages: Page[]
  painter: {
    apiKey: string
    baseURL: string
    model: string
    messages: Record<string, Message[]>
  }
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
    // Mermaid block parser
    const emitText = (chunk: string) => {
      if (!chunk || chunk.trim().length === 0) return
      const trimmedChunk = chunk.trim()
      chunker({ type: 'text', options: { chunk: trimmedChunk } } as TextChunkAction)
    }
    const parser = createBlockParser({
      pages: options.pages,
      emit: (action) => chunker(action),
      emitText: emitText,
    })

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
      // chunker({
      parser.handle({
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
export * from './title'
