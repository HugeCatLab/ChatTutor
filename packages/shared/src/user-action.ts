import { Action } from './action'

export type UserInputAction = Action<{ prompt: string }, 'user-input'>

export type UserAction =
  | UserInputAction
