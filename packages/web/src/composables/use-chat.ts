import type { Resource, UserInputAction, UserAbortAction } from '@chat-tutor/shared'
import { client } from '#/utils/client'
import { createMessageResolver, type ClientAction, type ClientMessage, type Page } from '@chat-tutor/shared'
import type { EdenWS } from '@elysiajs/eden/treaty'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { createActionStack } from './use-action-stack'
import { useSettingsStore } from '#/store/settings'
import { useRouter } from 'vue-router'

export const useChat = (id: string) => {
  const messages = ref<ClientMessage[]>([])
  const pages = ref<Page[]>([])
  const currentPage = ref<string | null>(null)
  const running = ref(false)
  const stream = ref<EdenWS | null>(null)
  const streamOpen = ref(false)
  const { baseURL, apiKey, agentModel, modelProvider } = useSettingsStore()
  const router = useRouter()

  const { push } = createActionStack('chat')

  const handleAction = (action: ClientAction) => {
    if (action.page) {
      push(action)
    }
    if (action.type === 'page-create') {
      pages.value.push(action.options.page)
      currentPage.value = action.options.page.id
    } else if (action.type === 'end') {
      running.value = false
    }
  }

  const resolveAction = createMessageResolver({
    get: () => messages.value,
    push: (message) => {
      messages.value.push(message)
    },
    uuid: () => uuidv4(),
  })

  const switchPage = (id: string) => {
    if (!Object.values(pages.value).some((page) => page.id === id)) {
      return
    }
    console.log('switchPage', id)
    currentPage.value = id
  }

  const sync = async () => {
    const { data, error } = await client.chat({ id }).get()
    if (error) {
      router.push({
        name: 'error',
        params: { type: 'chat', message: error.value.toString() },
      })
      return
    }
    if (!data) return
    messages.value = data.messages
    pages.value = data.pages
  }

  const ask = async (prompt: string, resources: Resource[]) => {
    running.value = true
    if (stream.value === null || !streamOpen.value) {
      const resolveQuery = (value: string | undefined) => {
        if (!value || value.trim() === '') return undefined
        return value.trim()
      }
      await new Promise((resolve) => {
        stream.value = client.chat({ id }).stream.subscribe({
          query: {
            apiKey: resolveQuery(apiKey),
            baseURL: resolveQuery(baseURL),
            model: resolveQuery(agentModel),
            provider: resolveQuery(modelProvider),
          },
        }) as EdenWS
        stream.value.on('open', () => {
          streamOpen.value = true
          resolve(true)
        })
        stream.value.on('close', () => {
          streamOpen.value = false
          stream.value = null
        })
        stream.value.on('message', (message) => {
          const action = message.data as unknown as ClientAction
          resolveAction(action)
          handleAction(action)
        })
      })
    }
    const action: UserInputAction = {
      type: 'user-input',
      options: {
        prompt,
        resources,
      },
    }
    stream.value?.send({
      action,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
    resolveAction(action)
  }

  const stop = () => {
    if (!stream.value || !running.value) return
    const action: UserAbortAction = {
      type: 'user-abort',
      options: {},
    }
    stream.value.send({
      action,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
  }

  return {
    messages,
    pages,
    currentPage,
    running,
    sync,
    ask,
    stop,
    switchPage,
  }
}