import z from 'zod'

export const GetModel = {
  query: z.object({
    limit: z.string().transform(Number).optional(),
    offset: z.string().transform(Number).optional(),
  }),
}

export const PostModel = {
  body: z.object({})
}
