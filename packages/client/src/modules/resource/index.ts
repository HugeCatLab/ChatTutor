import { Elysia } from 'elysia'
import { uploadImage } from './service'
import { PostImageModel } from './model'

export const resource = new Elysia({ prefix: '/resource' })
  .post('/image', async ({ body }) => {
    return await uploadImage(body)
  }, PostImageModel)