import { AgentOptions, AgentInput } from "./types"
import { createGateway, streamText } from "ai"

export const createAgent = (options: AgentOptions) => {
  const gateway = createGateway({
    apiKey: options.apiKey,
    baseURL: options.baseURL,
  })
  
  return async function* (input: AgentInput) {
    const { text, textStream } = streamText({
      model: gateway(options.model),
      messages: [
        ...options.messages,
        {
          role: "user", content: [
            { type: 'text', text: input.user },
            ...(input.images?.map(image => ({ type: 'image' as const, image: new URL(image) })) || []),
          ]
        },
      ],
    })
  }
}