# @chat-tutor/agent

## Usage

```ts
import { createAgent } from '@chat-tutor/agent'
import type { ClientMessage } from '@chat-tutor/shared'
import type { ModelMessage } from 'ai'

const messages: ClientMessage[] = []
const context: ModelMessage[] = []
const agent = createAgent({
  messages,
  context,
})

await agent({
  prompt: 'Hello, how are you?',
  emit: (action) => {
    console.log(action)
  },
  model: 'gpt-4',
  provider: 'openai',
  apiKey: 'your-api-key',
  baseURL: 'https://api.openai.com/v1',
  resources: [
    {
      type: 'image',
      url: 'https://example.com/image.png',
    }
  ],
})
```

---
**AGPL v3 License**

*Copyright (c) 2025 Acbox, All rights reserved.*