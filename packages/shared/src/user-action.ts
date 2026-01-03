import { Action } from './action'
import { Resource } from './resource'

export type UserInputAction = Action<{
  prompt: string
  resources?: Resource[]
}, 'user-input'>

export type UserAction =
  | UserInputAction
