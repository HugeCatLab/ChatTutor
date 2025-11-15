import { db } from '#shared/db'
import { chat } from '#shared/db/chat'
import type { Context } from '#shared/types'
import { resolveValue } from '#shared/utils/value'
import { getTitle } from '@chat-tutor/agent'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { input, titleModel: titleModelQuery, apiKey: apiKeyQuery, baseURL: baseURLQuery, agentModel: agentModelQuery } = getQuery(event) as {
    input: string,
    titleModel?: string,
    apiKey?: string,
    baseURL?: string,
    agentModel?: string,
  }
  const apiKey = resolveValue(apiKeyQuery, process.env.API_KEY!)
  const baseURL = resolveValue(baseURLQuery, process.env.BASE_URL!)
  const agentModel = resolveValue(agentModelQuery, process.env.AGENT_MODEL!)
  const titleModel = resolveValue(titleModelQuery, agentModel)
  const [{ id }] = await db
    .insert(chat)
    .values({
      title: 'Untitled',
      messages: [],
      context: {
        agent: [],
        painter: {},
      } satisfies Context,
      status: Status.PENDING,
      pages: [],
    })
    .returning({ id: chat.id })
  event.waitUntil((async () => {
    const title = await getTitle({
      apiKey,
      baseURL,
      model: titleModel,
      messages: [],
    }, input)
    await db.update(chat).set({ title }).where(eq(chat.id, id))
  })())
  return {
    id,
  }
})