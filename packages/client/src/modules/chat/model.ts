import z from 'zod'

export const GetModel = {
  query: z.object({
    limit: z.string().transform(Number).optional(),
    offset: z.string().transform(Number).optional(),
  }),
}

export const PostModel = {
  body: z.object({
    input: z.string(),
  }),
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
  query: z.object({
    apiKey: z.string().optional(),
    baseURL: z.string().optional(),
    model: z.string().optional(),
    provider: z.string().optional(),
  }),
  body: z.object({
    action: z.object({
      type: z.string(),
      options: z.object(),
    }),
  }),
}
