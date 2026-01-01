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

export const GetByIdModel = {

}

export const GetStatusModel = {
  params: z.object({
    id: z.string(),
  }),
}

export const GetStreamModel = {
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    action: z.object({
      type: z.string(),
      options: z.object(),
    }),
  }),
}
