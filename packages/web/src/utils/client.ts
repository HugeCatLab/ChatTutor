import { createAppClient } from '@chat-tutor/client/sdk'

export const client = createAppClient(import.meta.env.VITE_API_BASE_URL)