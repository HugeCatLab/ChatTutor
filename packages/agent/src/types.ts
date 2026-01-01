import type { ClientAction } from '@chat-tutor/shared'
import type { ModelMessage } from 'ai'

export interface AgentOptions {
  apiKey: string
  baseURL: string
  model: string
  messages: ModelMessage[]
}

export interface AgentInput {
  prompt: string
  emit: AgentEmitter
  images?: string[]
}

export type AgentEmitter<T = ClientAction> = (action: T) => void
