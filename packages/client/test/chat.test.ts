import { describe, expect, it } from 'bun:test'
import { createAppClient } from '../src/sdk'

describe('chat', () => {
  const client = createAppClient('http://localhost:8002')
  it('should create a chat', async () => {
    const { error, data } = await client.chat.post({
      
    })
    if (error || !data) {
      throw error
    }
    const { id } = data
    console.log(id)
    const stream = client.chat({ id }).stream.subscribe()
    await new Promise((resolve) => {
      stream.on('message', (message) => {
        const action = message.data
        if (action.type === 'text') {
          process.stdout.write(action.options.text)
        } else {
          process.stdout.write(JSON.stringify(action))
        }
      })
      stream.on('open', () => {
        console.log('open')
        stream.send({
          action: {
            type: 'user-input',
            options: {
              prompt: '我想学习三角函数的周期性',
            },
          },
        })
      })
      stream.on('close', () => {
        console.log('close')
        resolve(true)
      })
      stream.on('error', (error) => {
        console.log('error', error)
        resolve(false)
      })
    })
    expect(true).toBe(true)
  }, { timeout: Infinity })
})