import type { Message } from '#shared/types'
import type { ActionHandler } from './useBoard'
import type { FullAction, Action } from '@chat-tutor/shared'
import type { PageCreationAction, TextChunkAction } from '@chat-tutor/agent'
import type { CanvasPageAction } from '@chat-tutor/canvas'
import type { MermaidPageAction } from '@chat-tutor/mermaid'

export type AllAction = FullAction | Action | PageCreationAction | TextChunkAction | CanvasPageAction | MermaidPageAction

export const useChat = (
  handleAction: ActionHandler,
) => {
  const messages = ref<Message[]>([])
  const input = ref('')
  const { params } = useRoute()
  const id = params.id as string
  let eventSource: EventSource | null = null

  const send = async () => {
    const i = input.value
    input.value = ''
    if (eventSource) {
      eventSource.close()
      eventSource = null
    }

    messages.value.push({
      type: 'user',
      content: i,
      id: crypto.randomUUID(),
    })
    const add = () => messages.value.push({
      type: 'assistant',
      content: '',
      id: crypto.randomUUID(),
    })
    let divided: boolean = true
    
    eventSource = new EventSource(`/api/chat/${id}?input=${i}`)
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as AllAction
        console.log(data)
        if (divided) {
          add()
          divided = false
        }
        if (data.type === 'text') {
          messages.value.at(-1)!.content += (<TextChunkAction>data).options.chunk
        } else {
          divided = true
          handleAction(<FullAction>data)
        }
      } catch (error) {
        console.error('Failed to parse event data:', error)
      }
    }
    
    eventSource.onerror = (error) => {
      console.error('EventSource error:', error)
      if (eventSource) {
        eventSource.close()
        eventSource = null
      }
    }
    
    eventSource.onopen = () => {
      console.log('EventSource connected')
    }
  }

  const cleanup = () => {
    if (eventSource) {
      eventSource.close()
      eventSource = null
    }
  }

  const loadMessages = (msgs: Message[]) => {
    messages.value = msgs
  }

  onUnmounted(() => {
    cleanup()
  })

  return {
    messages,
    input,
    send,
    cleanup,
    loadMessages,
  }
}