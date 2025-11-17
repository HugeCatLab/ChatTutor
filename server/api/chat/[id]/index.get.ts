import { createAgent, type AgentChunker } from '@chat-tutor/agent'
import { db } from '#shared/db'
import { chat } from '#shared/db/chat'
import { eq } from 'drizzle-orm'
import type { FullAction, Page } from '@chat-tutor/shared'
import type { Message as DisplayMessage, Context, AllAction } from '#shared/types'
import { createMessageResolver } from '#shared/types/message'
import { resolveValue } from '#shared/utils/value'

async function imageUrlToBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString('base64')

    const contentType = response.headers.get('content-type') || 'image/jpeg'

    return `data:${contentType};base64,${base64}`
  } catch (error) {
    console.error(`Failed to convert image URL to base64: ${url}`, error)
    return url
  }
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event) as {
    input: string,
    images: string,
    apiKey?: string,
    baseURL?: string,
    agentModel?: string,
    painterModel?: string,
  }
  const { input, images: imagesString } = query
  const apiKey = resolveValue(query.apiKey, process.env.API_KEY!)
  const baseURL = resolveValue(query.baseURL, process.env.BASE_URL!)
  const agentModel = resolveValue(query.agentModel, process.env.AGENT_MODEL!)
  const painterModel = resolveValue(query.painterModel, resolveValue(query.agentModel, process.env.PAINTER_MODEL!))
  const isDev = process.env.NODE_ENV === 'development'

  let images = imagesString ? imagesString.split(',').filter(Boolean) : []

  if (isDev && images.length > 0) {
    images = await Promise.all(images.map(url => imageUrlToBase64(url)))
  }

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
  context.painter ??= {}

  updateStatus(Status.RUNNING)
  messages.push({
    type: 'user',
    content: input,
    images,
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
  const resolve = createMessageResolver(
    (message: DisplayMessage) => messages.push(message),
    () => messages,
    () => crypto.randomUUID(),
  )
  const send = (chunk: FullAction) => {
    resolve(chunk as AllAction)
    stream.push(JSON.stringify(chunk))
  }
  event.waitUntil((async () => {
    await agent(input, send as AgentChunker, {
      images
    })
  })().then(async () => {
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