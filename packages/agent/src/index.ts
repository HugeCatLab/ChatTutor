import { message, streamText, type Message, type StreamTextEvent } from 'xsai'
import * as prompts from './prompts'
import { getPageTools, getActionTools } from './tools'
import { PageType } from '@chat-tutor/shared'
import type { Action, FullAction, Page } from '@chat-tutor/shared'
import type { ReadableStream } from 'node:stream/web'
import type { CanvasPage } from '@chat-tutor/canvas'
import type { MermaidPage } from '@chat-tutor/mermaid'

export type TextChunkAction = Action<{ chunk: string }, 'text'>
export type PageCreationAction<T extends Page = Page> = Action<T, 'page'>
export type PageNoteAction = FullAction<{ content: string }, 'note'>

export interface AgentOptions {
  apiKey: string
  baseURL: string
  model: string
  messages: Message[]
  pages: Page[]
}

export const createAgent = (options: AgentOptions) => {
  if (options.messages.length === 0 || options.messages[0].role !== 'system') {
    options.messages.unshift(
      message.system(prompts.system())
    )
  }

   
  return async function* (input: string): AsyncGenerator<FullAction> {
    const tools = (await Promise.all([
      getPageTools(options.pages),
      getActionTools(options.pages)
    ])).flat()
    options.messages.push(message.user(input))
    const { fullStream, messages } = streamText({
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
    for await (const chunk of <ReadableStream<StreamTextEvent>>fullStream) {
      if (chunk.type === 'text-delta') {
        yield { type: 'text', options: { chunk: chunk.text } } satisfies TextChunkAction
      }
      if (chunk.type === 'tool-call') {
        if (chunk.toolName === 'act') {
          const { actions, page } = JSON.parse(chunk.args) as { page: string, actions: FullAction[] }
          for (const action of actions) {
            yield { ...action, page }
          }
        }
        if (chunk.toolName === 'create_canvas') {
          const { id, title, range, domain, axis, grid } = JSON.parse(chunk.args) as { id: string, title: string, range: [number, number], domain: [number, number], axis: boolean, grid: boolean }
          yield { type: 'page', options: { id, title, type: PageType.CANVAS, range, domain, axis, grid, steps: [], notes: [] } } satisfies PageCreationAction<CanvasPage>
        }
        if (chunk.toolName === 'create_mermaid') {
          const { id, title } = JSON.parse(chunk.args) as { id: string, title: string }
          yield { type: 'page', options: { id, title, type: PageType.MERMAID, steps: [], notes: [] } } satisfies PageCreationAction<MermaidPage>
        }
        if (chunk.toolName === 'note') {
          const { page, content } = JSON.parse(chunk.args) as { page: string, content: string }
          yield { type: 'note', options: { content }, page } satisfies PageNoteAction
        }
      }
    }
  }
}