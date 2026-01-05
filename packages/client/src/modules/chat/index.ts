import { Elysia } from 'elysia'
import { GetByIdModel, GetModel, GetStatusModel, GetStreamModel, PostModel } from './model'
import { createChat, createChatStream, getChatById, getChats, getChatStatus } from './service'
import { ClientMessage, Page, Status, UserAction } from '@chat-tutor/shared'
import { ChatIsRunningError } from './error'
import { AgentProvider } from '@chat-tutor/agent'

export const chat = new Elysia({ prefix: '/chat' })
  .error({
    ChatIsRunningError,
  })
  .get('/', async ({ query }) => {
    return await getChats(
      Number(query.limit) ?? 10,
      Number(query.offset) ?? 0,
    )
  }, GetModel)
  .post('/', async ({ body }) => {
    const id = await createChat(body.input)
    return {
      id
    }
  }, PostModel)
  .get('/:id', async ({ params }) => {
    const { id } = params
    return await getChatById(id) as {
      id: string
      title: string
      createdAt: Date
      updatedAt: Date
      status: Status
      pages: Page[]
      messages: ClientMessage[]
    }
  }, GetByIdModel)
  .get('/:id/status', async ({ params }) => {
    const { id } = params
    return await getChatStatus(id)
  }, GetStatusModel)
  .ws('/:id/stream', (() => {
    const { update, act, open } = createChatStream()
    return {
      ...GetStreamModel,
      async open({ data }) {
        await update(data.params.id)
        await open({
          apiKey: data.query.apiKey,
          baseURL: data.query.baseURL,
          model: data.query.model,
          provider: data.query.provider as AgentProvider,
        })
      },
      async message({ send, data }, message) {
        const { action } = message as { action: UserAction }
        act(data.params.id, action, send).catch(console.error)
      },
    }
  })())