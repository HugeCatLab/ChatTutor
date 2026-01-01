import { Elysia } from 'elysia'
import { GetByIdModel, GetModel, GetStatusModel, GetStreamModel, PostModel } from './model'
import { createChat, createChatStream, getChatById, getChats, getChatStatus } from './service'
import { UserAction } from '@chat-tutor/shared'

export const chat = new Elysia({ prefix: '/chat' })
  .get('/', async ({ query }) => {
    return await getChats(
      Number(query.limit) ?? 10,
      Number(query.offset) ?? 0,
    )
  }, GetModel)
  .post('/', async ({ }) => {
    const id = await createChat()
    return {
      id
    }
  }, PostModel)
  .get('/:id', async ({ params }) => {
    const { id } = params
    return await getChatById(id)
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
        await open()
      },
      async message({ send }, message) {
        const { action } = message as { action: UserAction }
        await act(action, send)
      },
    }
  })())