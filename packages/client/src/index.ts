import { Elysia } from 'elysia'
import { chat } from './modules/chat'
import { corsMiddleware } from './middlewares/cors'


export const app = new Elysia()
  .use(chat)
  .use(corsMiddleware)
  .listen(8002)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
