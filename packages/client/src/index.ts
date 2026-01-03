import { Elysia } from 'elysia'
import { chat } from './modules/chat'
import { resource } from './modules/resource'
import { corsMiddleware } from './middlewares/cors'


export const app = new Elysia()
  .use(chat)
  .use(resource)
  .use(corsMiddleware)
  .listen(8002)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
