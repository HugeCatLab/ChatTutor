import { pgTable, uuid, timestamp, text, jsonb } from 'drizzle-orm/pg-core'
import type { Context } from '#shared/types'

export const chat = pgTable('chat', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),

  pages: jsonb('pages').array().notNull().default([]),
  messages: jsonb('messages').array().notNull().default([]),
  context: jsonb('context').notNull().default(
    JSON.stringify({
      agent: [],
      painter: [],
    } satisfies Context)
  ),

  status: text('status').notNull().default('pending'),
})