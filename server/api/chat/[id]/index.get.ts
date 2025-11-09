import { createAgent, type AgentChunker } from '@chat-tutor/agent'
import { db } from '#shared/db'
import { chat } from '#shared/db/chat'
import { eq } from 'drizzle-orm'
import type { FullAction, Page } from '@chat-tutor/shared'
import type { Message as DisplayMessage, Context } from '#shared/types'

export default defineEventHandler(async (event) => {
  const apiKey = process.env.API_KEY!
  const baseURL = process.env.BASE_URL!
  const agentModel = process.env.AGENT_MODEL!
  const painterModel = process.env.PAINTER_MODEL!
  const { input } = getQuery(event) as { input: string }
  const { id } = getRouterParams(event)

  const [{ pages, context, status, messages }]
    = await db.select().from(chat).where(eq(chat.id, id)) as { pages: Page[], context: Context, status: Status, messages: DisplayMessage[] }[]
  const updateStatus = async (status: Status) => await db.update(chat).set({ status }).where(eq(chat.id, id))

  if (status === Status.RUNNING) {
    return createError({
      statusCode: 400,
      statusMessage: 'Chat is running',
    })
  }

  context.agent ??= []
  context.painter ??= []

  updateStatus(Status.RUNNING)
  messages.push({
    type: 'user',
    content: input,
    id: crypto.randomUUID(),
  })

  const agent = createAgent({
    apiKey,
    baseURL,
    model: agentModel,
    messages: context.agent,
    pages,
    painter: {
      apiKey,
      baseURL,
      model: painterModel,
      messages: context.painter,
    },
  })
  const stream = createEventStream(event)
  const addAsistant = () => messages.push({
    type: 'assistant',
    content: '',
    id: crypto.randomUUID(),
  })
  let divided: boolean = true
  const send = (chunk: FullAction) => {
    if (chunk.type === 'text') {
      if (divided) {
        addAsistant()
        divided = false
      }
      messages.at(-1)!.content += chunk.options.chunk
    } else {
      divided = true
    }
    stream.push(JSON.stringify(chunk))
  }
  event.waitUntil((async () => {
    if (divided) {
      addAsistant()
      divided = false
    }
    await agent(input, send as AgentChunker)
  })().then(async () => {
    console.log(context)
    await db.update(chat).set({
      context,
      status: Status.COMPLETED,
      messages,
      pages,
    }).where(eq(chat.id, id))
    stream.close()
  }).catch(async (_error) => {
    await updateStatus(Status.FAILED)
  }))
  return stream.send()
})