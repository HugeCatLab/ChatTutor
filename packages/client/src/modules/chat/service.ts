import { chat } from '@chat-tutor/db/schema'
import { db } from '@chat-tutor/db'
import { eq } from 'drizzle-orm'
import { ClientAction, ClientMessage, Context, createMessageResolver, Status, UserAction } from '@chat-tutor/shared'
import { AgentProvider, createAgent } from '@chat-tutor/agent'
import { ModelMessage } from 'ai'

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
    .limit(limit)
    .offset(offset)
    return chats
  } catch (error) {
    console.error(error)
    return []
  }
  
}

export const createChat = async () => {
  const [{ id }] = await db
    .insert(chat)
    .values({
      title: 'New Chat',
      status: ''
    })
    .returning({
      id: chat.id
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

export const getChatStatus = async (id: string) => {
  const [result] = await db
    .select({
      status: chat.status,
    })
    .from(chat)
    .where(eq(chat.id, id))
  return result.status as Status
}

export const createChatStream = () => {
  const agentContext: ModelMessage[] = []
  const messages: ClientMessage[] = []
  const update = async (id: string) => {
    const [c, m] = await Promise.all([
      getChatContext(id),
      getChatMessages(id),
    ])
    messages.length = 0
    messages.push(...m)
    agentContext.length = 0
    agentContext.push(...c.agent)
  }
  const resolve = createMessageResolver({
    messages,
    uuid: () => crypto.randomUUID(),
  })
  const agent = createAgent({
    messages: agentContext,
    apiKey: process.env.MODEL_API_KEY!,
    baseURL: process.env.MODEL_BASE_URL!,
    model: process.env.AGENT_MODEL!,
    provider: process.env.AGENT_MODEL_PROVIDER as AgentProvider,
  })
  return {
    update,
    async open() { },
    async act(input: UserAction, emit: (action: ClientAction) => void) {
      resolve(input)
      if (input.type === 'user-input') {
        await agent({
          prompt: input.options.prompt,
          emit,
          images: [],
        })
        console.log(agentContext.length)
      }
    },
  }
}
