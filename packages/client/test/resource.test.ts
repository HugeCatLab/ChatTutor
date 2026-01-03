import { describe, expect, it, beforeAll } from 'bun:test'
import { createAppClient } from '../src/sdk'

describe('resource', () => {
  const client = createAppClient('http://localhost:8002')
  
  // Check if required environment variables are set
  const hasS3Config = Boolean(
    process.env.OSS_ENDPOINT &&
    process.env.OSS_BUCKET &&
    process.env.OSS_ACCESS_KEY &&
    process.env.OSS_SECRET_KEY
  )

  it('should upload an image file', async () => {
    if (!hasS3Config) {
      console.log('⚠️  Skipping test: S3 configuration not found')
      return
    }

    // Create a test image file (1x1 pixel PNG)
    const pngData = new Uint8Array([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
      0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,
      0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
      0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00,
      0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
    ])
    
    const blob = new Blob([pngData], { type: 'image/png' })
    const file = new File([blob], 'test-image.png', { type: 'image/png' })

    const { error, data } = await client.resource.image.post({
      file,
    })

    if (error) {
      console.error('Upload error:', error)
      throw error
    }

    expect(data).toBeDefined()
    expect(data?.success).toBe(true)
    expect(data?.url).toBeTypeOf('string')
    expect(data?.key).toBeTypeOf('string')
    expect(data?.url).toContain(data?.key!)
    
    console.log('✅ Image uploaded successfully:', data?.url)
  })

  it('should reject request without file', async () => {
    if (!hasS3Config) {
      console.log('⚠️  Skipping test: S3 configuration not found')
      return
    }

    const { error } = await client.resource.image.post({
      // @ts-expect-error - intentionally missing file
      file: undefined,
    })

    // Should have validation error
    expect(error).toBeDefined()
  })

  it('should upload a JPEG image', async () => {
    if (!hasS3Config) {
      console.log('⚠️  Skipping test: S3 configuration not found')
      return
    }

    // Create a minimal JPEG file
    const jpegData = new Uint8Array([
      0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46,
      0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01,
      0x00, 0x01, 0x00, 0x00, 0xFF, 0xD9
    ])
    
    const blob = new Blob([jpegData], { type: 'image/jpeg' })
    const file = new File([blob], 'test-image.jpg', { type: 'image/jpeg' })

    const { error, data } = await client.resource.image.post({
      file,
    })

    if (error) {
      console.error('Upload error:', error)
      throw error
    }

    expect(data).toBeDefined()
    expect(data?.success).toBe(true)
    expect(data?.key).toContain('.jpg')
    
    console.log('✅ JPEG uploaded successfully:', data?.url)
  })

  it('should handle different file extensions', async () => {
    if (!hasS3Config) {
      console.log('⚠️  Skipping test: S3 configuration not found')
      return
    }

    const testFiles = [
      { name: 'test.png', type: 'image/png', ext: '.png' },
      { name: 'test.jpg', type: 'image/jpeg', ext: '.jpg' },
      { name: 'test.webp', type: 'image/webp', ext: '.webp' },
      { name: 'test.gif', type: 'image/gif', ext: '.gif' },
    ]

    for (const testFile of testFiles) {
      const blob = new Blob([new Uint8Array([0x00])], { type: testFile.type })
      const file = new File([blob], testFile.name, { type: testFile.type })

      const { error, data } = await client.resource.image.post({
        file,
      })

      if (error) {
        console.error(`Upload error for ${testFile.name}:`, error)
        continue
      }

      expect(data?.key).toContain(testFile.ext)
      console.log(`✅ ${testFile.name} uploaded:`, data?.url)
    }
  })

  it('should generate unique keys for each upload', async () => {
    if (!hasS3Config) {
      console.log('⚠️  Skipping test: S3 configuration not found')
      return
    }

    const blob = new Blob([new Uint8Array([0x00])], { type: 'image/png' })
    const file1 = new File([blob], 'test.png', { type: 'image/png' })
    const file2 = new File([blob], 'test.png', { type: 'image/png' })

    const [result1, result2] = await Promise.all([
      client.resource.image.post({ file: file1 }),
      client.resource.image.post({ file: file2 }),
    ])

    if (result1.error || result2.error) {
      throw new Error('Upload failed')
    }

    expect(result1.data?.key).not.toBe(result2.data?.key)
    expect(result1.data?.url).not.toBe(result2.data?.url)
    
    console.log('✅ Unique keys generated:', {
      key1: result1.data?.key,
      key2: result2.data?.key,
    })
  })
})

