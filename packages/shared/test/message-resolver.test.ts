import { describe, it, expect } from 'vitest'
import { createMessageResolver, ClientMessage, ClientAction } from '@chat-tutor/shared'

describe('message-resolver', () => {
  it('should create a message resolver', () => {
    const messages: ClientMessage[] = []
    const messageResolver = createMessageResolver({
      messages,
      uuid: () => crypto.randomUUID(),
    })

    const actions: ClientAction[] = [
      {
        type: 'text',
        options: { text: 'Hello, ' },
      },
      {
        type: 'text',
        options: { text: 'world!' },
      },
    ]

    actions.forEach(action => {
      messageResolver(action)
    })

    expect(messages).toStrictEqual([
      {
        type: 'agent',
        id: expect.any(String),
        content: 'Hello, world!',
      }
    ])
  })
})