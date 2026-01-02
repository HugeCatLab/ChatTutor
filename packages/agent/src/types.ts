import type { ClientAction, Page, Resource } from '@chat-tutor/shared'
import type { ImagePart, ModelMessage } from 'ai'

export const convertResources = (resources: Resource[]): (ImagePart)[] => {
  return resources.map(resource => {
    if (resource.type === 'image') {
      return {
        type: 'image' as const,
        image: new URL(resource.url),
      }
    }
  }).filter((r) => r !== undefined)
}

export type AgentProvider =
  | 'openai'
  | 'anthropic'
  | 'deepseek'

export interface AgentOptions {
  apiKey: string
  baseURL: string
  model: string
  provider?: AgentProvider
  messages: ModelMessage[]
  pages: Page[]
}

export interface AgentInput {
  prompt: string
  emit: AgentEmitter
  resources?: Resource[]
}

export type AgentEmitter<T = ClientAction> = (action: T) => void
