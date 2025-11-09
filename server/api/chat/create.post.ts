import { db } from '#shared/db'
import { chat } from '#shared/db/chat'
import type { Context } from '#shared/types'

export default defineEventHandler(async () => {
  const [{ id }] = await db
    .insert(chat)
    .values({
      title: 'Untitled',
      messages: [],
      context: {
        agent: [],
        painter: [],
      } satisfies Context,
      status: Status.PENDING,
      pages: [],
    })
    .returning({ id: chat.id })
  return {
    id,
  }
})