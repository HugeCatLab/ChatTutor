import { Message } from 'xsai'
import { createPainterAgent } from '../painter'
import { describe, it, expect } from 'vitest'

describe('Painter Agent', () => {
  it('should paint a simple rectangle', async () => {
    const messages: Message[] = []
    const agent = createPainterAgent({
      messages,
      model: process.env.PAINTER_MODEL!,
      apiKey: process.env.API_KEY!,
      baseURL: process.env.BASE_URL!,
    })
    const result = await agent('Draw a simple triangle, A = (0, 0), B = (3, 4), C = (1, 2)', (chunk) => {
      // console.log(chunk)
    })
    const id = crypto.randomUUID()
    console.log(result)
    // expect(result).toBeTypeOf('string')
    expect(result).toMatchFileSnapshot(`__snapshots__/painter.test.${id}.md`)
    expect(messages).toMatchFileSnapshot(`__snapshots__/painter.test.${id}.messages.json`)
  })
})