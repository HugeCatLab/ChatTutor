import { chat } from '@chat-tutor/db/schema'
import { db } from '@chat-tutor/db'

console.log(process.env.DATABASE_URL)

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