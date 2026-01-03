import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { PostImageModel } from './model'
import type { z } from 'zod'

type UploadImageBody = z.infer<typeof PostImageModel.body>

export const uploadImage = async (body: UploadImageBody) => {
  const client = new S3Client({
    region:
      !process.env.OSS_REGION || process.env.OSS_REGION === ''
        ? 'default'
        : process.env.OSS_REGION,
    endpoint: process.env.OSS_ENDPOINT,
    credentials: {
      accessKeyId: process.env.OSS_ACCESS_KEY!,
      secretAccessKey: process.env.OSS_SECRET_KEY!,
    },
    forcePathStyle: true,
  })

  const file = body.file

  if (!file) {
    throw new Error('No file uploaded')
  }

  const id = crypto.randomUUID()
  const fileExtension = file.name.split('.').pop()
  const key = `${id}.${fileExtension}`

  // Convert File to Buffer
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const command = new PutObjectCommand({
    Bucket: process.env.OSS_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: file.type || 'image/jpeg',
  })

  await client.send(command)

  const publicUrl = `${process.env.OSS_ENDPOINT}/${process.env.OSS_BUCKET}/${key}`

  return {
    success: true,
    url: publicUrl,
    key,
  }
}