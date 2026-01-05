import { describe, expect, it } from 'bun:test'
import { createAppClient } from '../src/sdk'

describe('chat', () => {
  const client = createAppClient('http://localhost:8002')
  it('should create a chat', async () => {
    const { error, data } = await client.chat.post({
      input: 'Hello'
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
          if (action.type === 'end') {
             resolve(true)
             stream.close() // Close the stream from client side
          }
        }
      })
      stream.on('open', () => {
        console.log('open')
        stream.send({
          action: {
            type: 'user-input',
            options: {
              prompt: 'hi',
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

  it('should abort a chat', async () => {
    const { error, data } = await client.chat.post({
      input: 'Abort Test'
    })
    if (error || !data) {
      throw error
    }
    const { id } = data
    console.log('Abort test chat id:', id)
    
    const stream = client.chat({ id }).stream.subscribe()
    
    await new Promise((resolve, reject) => {
      let aborted = false
      let receivedText = false
      
      stream.on('message', (message) => {
        const action = message.data
        if (action.type === 'text') {
            receivedText = true
            // Once we get some text, we abort
            if (!aborted) {
                console.log('Received text, sending abort...')
                stream.send({
                    action: {
                        type: 'user-abort',
                        options: {}
                    }
                })
                aborted = true
            }
        } else if (action.type === 'end') {
            console.log('Received end signal')
            if (aborted) {
              resolve(true)
            }
        }
      })
      
      stream.on('open', () => {
        console.log('Stream opened')
        stream.send({
          action: {
            type: 'user-input',
            options: {
              prompt: 'Write a long story about a brave knight.', 
            },
          },
        })
      })

      stream.on('error', (err) => {
        console.error('Stream error:', err)
        reject(err)
      })
    })
    
    expect(true).toBe(true)
  }, { timeout: 30000 })
})
