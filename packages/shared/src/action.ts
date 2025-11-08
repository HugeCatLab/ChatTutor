import { type } from 'arktype'
import type { Page } from './page'

export const BaseAction = type({
  type: 'string',
  options: type.object
})

export type Action<T extends object = Record<string, unknown>, A extends string = string> = typeof BaseAction.infer & {
  type: A
  options: T
}

export interface FullAction<T extends object = Record<string, unknown>, A extends string = string> extends Action<T, A> {
  page?: string
}

export type ActionResolver<T extends Action = FullAction, P extends Page = Page> = (action: T, page: P) => {
  success: boolean
  action: T['type']
  message: string | object
}
export type ActionResolverMap = Map<string, ActionResolver>
