import type { Resource } from '@chat-tutor/shared'

export interface PromptAreaEmits {
  (e: 'send', input: string, resources: Resource[]): void
}

export interface PromptAreaProps {
  running?: boolean
}

