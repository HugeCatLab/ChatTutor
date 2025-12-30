import { Elysia } from 'elysia'
import { GetModel, PostModel } from './model'
import { createChat, getChats } from './service'

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