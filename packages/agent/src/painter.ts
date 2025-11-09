import type { CanvasPage, Element } from '@chat-tutor/canvas'
import type { AgentChunker, BaseAgentOptions } from './types'
import { message, streamText, type StreamTextEvent } from 'xsai'
import { painter } from './prompts'
import { getPainterTools } from './tools/painter'
import type { ReadableStream } from 'node:stream/web'

export interface PainterAgentOptions extends BaseAgentOptions {
  page: CanvasPage
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
    const tools = await getPainterTools(options.page, chunker)
    options.messages.push(message.user(input))
    const { fullStream, messages } = streamText({
      model: options.model,
      apiKey: options.apiKey,
      baseURL: options.baseURL,
      messages: options.messages,
      tools,
      maxSteps: 4,
    })
    messages.then(ms => {
      options.messages.length = 0
      options.messages.push(...ms)
    })
    for await (const chunk of <ReadableStream<StreamTextEvent>>fullStream) {
      if (chunk.type === 'tool-call') {
        if (chunk.toolName === 'add') {
          const { elements } = JSON.parse(chunk.args) as { elements: Element[] }
          for (const element of elements) {
            chunker({ type: 'element', options: element })
          }
        }
      }
    }
    const lastMessage = options.messages.at(-1)
    if (lastMessage && lastMessage.role === 'assistant') {
      return lastMessage.content as string
    }
    return ''
  }
}
