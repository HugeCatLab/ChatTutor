import type { Message, AllAction } from '#shared/types'
import type { ActionHandler } from './useBoard'
import { createMessageResolver } from '#shared/types/message'
import type { FullAction } from '@chat-tutor/shared'
import { v4 } from 'uuid'
import type { Resource } from '../components/PromptArea.vue'

export const useChat = (
  handleAction: ActionHandler,
) => {
  const messages = ref<Message[]>([])
  const resources = ref<Resource[]>([])
  const resolve = createMessageResolver(
    (message: Message) => messages.value.push(message),
    () => messages.value,
  )
  const input = ref('')
  const running = ref(false)
  const { params } = useRoute()
  const id = params.id as string
  let eventSource: EventSource | null = null

  const send = async () => {
    running.value = true
    const i = input.value
    const images = resources.value.filter(r => r.type === 'image').map(r => r.url)
    resources.value.length = 0
    input.value = ''
    if (eventSource) {
      eventSource.close()
      eventSource = null
    }

    messages.value.push({
      type: 'user',
      content: i,
      images,
      id: v4(),
    })
    
    eventSource = new EventSource(`/api/chat/${id}?input=${i}&images=${images.join(',')}`)
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as AllAction
        // Important debug function to see what's been outputted by the LLM
        // if (data.type === 'text') {
        //   console.debug('[LLM text chunk]: ', data.options.chunk)
        // }
        // else if (data.type === 'note') {
        //   console.debug('[LLM note chunk]: ', data.options.content)
        // }
        handleAction(data as FullAction)
        resolve(data)
      } catch (error) {
        console.error('Failed to parse event data:', error)
      }
    }
    
    eventSource.onerror = (error) => {
      console.error('EventSource error:', error)
      if (eventSource) {
        eventSource.close()
        eventSource = null
        running.value = false
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
    running.value = false
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
    resources,
    running,
    send,
    cleanup,
    loadMessages,
  }
}