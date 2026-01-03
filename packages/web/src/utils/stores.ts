import { defineStore } from 'pinia'
import type { Resource } from '@chat-tutor/shared'

export interface CreateChatState {
  prompt: string | null
  resources: Resource[]
}
export const useCreateChatStore = defineStore('create-chat', {
  state: (): CreateChatState => ({
    prompt: null,
    resources: [],
  }),
})
