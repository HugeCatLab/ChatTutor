import type { Message } from 'xsai'

export interface BaseAgentOptions {
  apiKey: string
  baseURL: string
  model: string
  messages: Message[]
}

export type AgentChunker<T = unknown> = (chunk: T) => void
