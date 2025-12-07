import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

export default defineEventHandler(async (event) => {
  console.log(
    JSON.stringify({ s: process.env.OSS_REGION }),
    process.env.OSS_ENDPOINT,
    process.env.OSS_ACCESS_KEY,
    process.env.OSS_SECRET_KEY
  )
  const client = new S3Client({
    region:
      process.env.OSS_REGION || process.env.OSS_REGION === ''
        ? 'default'
        : process.env.OSS_REGION,
    endpoint: process.env.OSS_ENDPOINT,
    credentials: {
      accessKeyId: process.env.OSS_ACCESS_KEY!,
      secretAccessKey: process.env.OSS_SECRET_KEY!,
    },
    forcePathStyle: true,
  })

  const formData = await readMultipartFormData(event)
  const file = formData?.find((f) => f.name === 'file')

  if (!file?.data || !file.filename) {
    throw createError({ statusCode: 400, message: 'No file uploaded' })
  }

  const id = crypto.randomUUID()

  const key = `${id}.${file.filename.split('.').pop()}`
  const command = new PutObjectCommand({
    Bucket: process.env.OSS_BUCKET,
    Key: key,
    Body: file.data,
    ContentType: file.type || 'image/jpeg',
  })

  await client.send(command)

  const publicUrl = `${process.env.OSS_ENDPOINT}/${process.env.OSS_BUCKET}/${key}`

  return { url: publicUrl, id, key }
})
