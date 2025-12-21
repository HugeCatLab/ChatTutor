import { message, streamText } from 'xsai'
import { agent } from './prompts'
import type { Action, FullAction, Page } from '@chat-tutor/shared'
import type { ReadableStream } from 'node:stream/web'
import type { AgentChunker, BaseAgentOptions } from './types'
import { createBlockParser } from './utils/blockParser'

export type TextChunkAction = Action<{ chunk: string }, 'text'>
export type PageCreationAction<T extends Page = Page> = Action<T, 'page'>
export type PageNoteAction = FullAction<{ content: string }, 'note'>

// Start/End actions for note, mermaid, and ggb
export type NoteStartAction = FullAction<{ page: string }, 'note-start'>
export type NoteEndAction = FullAction<{ page: string }, 'note-end'>
export type MermaidStartAction = FullAction<{ page: string }, 'mermaid-start'>
export type MermaidEndAction = FullAction<{ page: string }, 'mermaid-end'>
export type GGBStartAction = FullAction<{ page: string }, 'ggb-start'>
export type GGBEndAction = FullAction<{ page: string }, 'ggb-end'>

// Plan actions
export type PlanStartAction = Action<Record<string, never>, 'plan-start'>
export type PlanEndAction = Action<{ content: string }, 'plan-end'>

export interface AgentOptions extends BaseAgentOptions {
  pages: Page[]
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
      if (!chunk || chunk.length === 0) return
      chunker({ type: 'text', options: { chunk } } as TextChunkAction)
    }
    const parser = createBlockParser({
      pages: options.pages,
      emit: (action) => chunker(action),
      emitText: emitText,
    })
    options.messages.push(message.user(
      [message.textPart(input), ...(images ?? []).map(i => message.imagePart(i))]
    ))
    const { textStream, messages } = streamText({
      model: options.model,
      apiKey: options.apiKey,
      baseURL: options.baseURL,
      messages: options.messages,
      // tools,
      maxSteps: 15,
    })
    messages.then(ms => {
      options.messages.length = 0
      options.messages.push(...ms)
    })
    for await (const chunk of <ReadableStream<string>>textStream) {
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
export * from './types'
export * from './title'
export * from './utils'
