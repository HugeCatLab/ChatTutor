import { Action } from './action'
import { Resource } from './resource'

export type UserInputAction = Action<{
  prompt: string
  resources?: Resource[]
}, 'user-input'>

export type UserAbortAction = Action<object, 'user-abort'>

export type UserAction =
  | UserInputAction
  | UserAbortAction
