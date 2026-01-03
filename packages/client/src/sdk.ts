import { app } from '.'
import { treaty } from '@elysiajs/eden'

export type App = typeof app

export const createAppClient = (baseURL: string) => {
  return treaty<App>(baseURL)
}
