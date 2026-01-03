import z from 'zod'

export const PostImageModel = {
  body: z.object({
    file: z.instanceof(File, {
      message: 'File is required',
    }),
  }),
}

