import { chat } from '@chat-tutor/db/schema'
import { db } from '@chat-tutor/db'
import { desc, eq } from 'drizzle-orm'
import { ClientAction, ClientMessage, Context, createMessageResolver, Page, Status, UserAction } from '@chat-tutor/shared'
import { AgentProvider, createAgent, getTitle } from '@chat-tutor/agent'
import { ModelMessage } from 'ai'
import { AgentConfigError, ChatIsRunningError } from './error'

export const getChats = async (limit: number, offset: number) => {
  try {
    const chats = await db
    .select({
      id: chat.id,
      title: chat.title,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    })
    .from(chat)
    .orderBy(desc(chat.createdAt))
    .limit(limit)
    .offset(offset)
    return chats
  } catch (error) {
    console.error(error)
    return []
  }
  
}

export const updateChatTitle = async (id: string, title: string) => {
  await db
    .update(chat)
    .set({
      title,
    })
    .where(eq(chat.id, id))
}

export const createChat = async (input: string) => {
  const [{ id }] = await db
    .insert(chat)
    .values({
      title: 'New Chat',
      status: ''
    })
    .returning({
      id: chat.id
    })
  getTitle({
    apiKey: process.env.MODEL_API_KEY!,
    baseURL: process.env.MODEL_BASE_URL!,
    model: process.env.TITLE_MODEL || process.env.AGENT_MODEL!,
    provider: (process.env.TITLE_MODEL_PROVIDER || process.env.AGENT_MODEL_PROVIDER) as AgentProvider,
  }, input).then(title => {
    updateChatTitle(id, title)
  })
  return id
}

export const getChatById = async (id: string) => {
  const [result] = await db
    .select({
      id: chat.id,
      title: chat.title,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      status: chat.status,
      pages: chat.pages,
      messages: chat.messages,
    })
    .from(chat)
    .where(eq(chat.id, id))
  return result
}

export const getChatContext = async (id: string) => {
  const [result] = await db
    .select({
      context: chat.context,
    })
    .from(chat)
    .where(eq(chat.id, id))
  return result.context as Context
}

export const getChatMessages = async (id: string) => {
  const [result] = await db
    .select({
      messages: chat.messages,
    })
    .from(chat)
    .where(eq(chat.id, id))
  return result.messages as ClientMessage[]
}

export const getChatPages = async (id: string) => {
  const [result] = await db
    .select({
      pages: chat.pages,
    })
    .from(chat)
    .where(eq(chat.id, id))
  return result.pages as Page[]
}

export const getChatRecord = async (id: string) => {
  const [result] = await db
    .select({
      id: chat.id,
      context: chat.context,
      messages: chat.messages,
      pages: chat.pages,
    })
    .from(chat)
    .where(eq(chat.id, id))
  return result as {
    id: string
    context: Context
    messages: ClientMessage[]
    pages: Page[]
  }
}

export const updateChatRecord = async (
  { id, context, messages, pages }: {
    id: string
    context: Context
    messages: ClientMessage[]
    pages: Page[]
  }) => {
  await db
    .update(chat)
    .set({
      context,
      messages,
      pages,
    })
    .where(eq(chat.id, id))
}

export const getChatStatus = async (id: string) => {
  const [result] = await db
    .select({
      status: chat.status,
    })
    .from(chat)
    .where(eq(chat.id, id))
  return result.status as Status
}

export const updateChatStatus = async (id: string, status: Status) => {
  await db
    .update(chat)
    .set({
      status,
    })
    .where(eq(chat.id, id))
}

export const createChatStream = () => {
  const agentContext: ModelMessage[] = []
  const messages: ClientMessage[] = []
  const pages: Page[] = []
  let apiKey = process.env.MODEL_API_KEY
  let baseURL = process.env.MODEL_BASE_URL
  let model = process.env.AGENT_MODEL
  let provider = process.env.AGENT_MODEL_PROVIDER as AgentProvider
  let controller: AbortController | null = null
  const update = async (id: string) => {
    const { context: c, messages: m, pages: p } = await getChatRecord(id)
    messages.length = 0
    messages.push(...m)
    pages.length = 0
    pages.push(...p)
    agentContext.length = 0
    agentContext.push(...c.agent)
  }
  const resolve = createMessageResolver({
    get: () => messages,
    push: (message) => {
      messages.push(message)
    },
    uuid: () => crypto.randomUUID(),
  })
  const agent = createAgent({
    messages: agentContext,
    pages,
  })
  return {
    update,
    async open(query: {
      apiKey?: string
      baseURL?: string
      model?: string
      provider?: AgentProvider
    }) {
      if (query.apiKey) apiKey = query.apiKey
      if (query.baseURL) baseURL = query.baseURL
      if (query.model) model = query.model
      if (query.provider) provider = query.provider
    },
    async act(id: string, input: UserAction, emit: (action: ClientAction) => void) {      
      if (input.type === 'user-abort') {
        if (controller) {
          controller.abort()
        }
        return
      }

      await update(id)
      
      resolve(input)
      try {
        if (input.type === 'user-input') {
          const status = await getChatStatus(id)
          if (status === Status.RUNNING) {
            throw new ChatIsRunningError('Chat is already running')
          }
          
          controller = new AbortController()
          await updateChatStatus(id, Status.RUNNING)
          if (!apiKey || !baseURL || !model || !provider) {
            throw new AgentConfigError('Agent configuration is not set')
          }
          await agent({
            prompt: input.options.prompt,
            emit: (action) => {
              resolve(action)
              emit(action)
            },
            resources: input.options.resources || [],
            apiKey,
            baseURL,
            model,
            provider,
            signal: controller.signal,
          })
          await updateChatRecord({
            id,
            context: {
              agent: agentContext,
            },
            messages,
            pages,
          })
          await updateChatStatus(id, Status.COMPLETED)
        }
      } catch (error: any) {
        if (controller) {
          await updateChatRecord({
            id,
            context: {
              agent: agentContext,
            },
            messages,
            pages,
          })
        }
        const isAbort = error.name === 'AbortError' || error.message?.includes('aborted')
        await updateChatStatus(id, isAbort ? Status.COMPLETED : Status.FAILED)
        throw error
      } finally {
        if (controller && !controller.signal.aborted) {
          controller.abort()
        }
        controller = null
      }
    },
  }
}
