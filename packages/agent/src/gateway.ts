import { createOpenAI } from '@ai-sdk/openai'

export interface GatewayOptions {
  apiKey: string
  baseURL: string
  provider?: 'openai'
}

export const createGateway = ({ apiKey, baseURL, provider = 'openai' }: GatewayOptions) => {
  switch (provider) {
    case 'openai':
      return createOpenAI({
        apiKey,
        baseURL,
      })
  }
}