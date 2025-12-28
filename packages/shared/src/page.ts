import { Action } from "./action"

export interface BasePage {
  id: string
  title: string
  type: string
  steps: Action<any, any>[]
}