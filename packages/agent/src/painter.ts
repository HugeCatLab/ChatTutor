import type { CanvasPage } from '@chat-tutor/canvas'
import type { AgentChunker, BaseAgentOptions } from './types'
import { message, streamText, type StreamTextEvent } from 'xsai'
import { painter } from './prompts'
import type { ReadableStream } from 'node:stream/web'

export interface PainterAgentOptions extends BaseAgentOptions {
  // page: CanvasPage
}

export const createPainterAgent = (options: PainterAgentOptions) => {
  if (options.messages.length === 0 || options.messages[0].role !== 'system') {
    options.messages.unshift(
      message.system(painter.system())
    )
  }

  return async (
    input: string,
    chunker: AgentChunker
  ): Promise<string> => {
    options.messages.push(message.user(input))
    const { fullStream, messages } = streamText({
      model: options.model,
      apiKey: options.apiKey,
      baseURL: options.baseURL,
      messages: options.messages,
      maxSteps: 4,
    })
    const msgs = await messages
    options.messages.length = 0
    options.messages.push(...msgs)
    return msgs[msgs.length - 1].content as string
  }
}
