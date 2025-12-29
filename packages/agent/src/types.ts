import type { ModelMessage } from 'ai'

export interface AgentOptions {
  apiKey: string
  baseURL: string
  model: string
  messages: ModelMessage[]
}

export interface AgentInput {
  user: string
  images?: string[]
}

export type AgentChunker<T = unknown> = (chunk: T) => void
