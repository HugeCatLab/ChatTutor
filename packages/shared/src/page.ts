import { Action } from "./action"

export interface BasePage {
  id: string
  title: string
  type: string
  steps: Action<any, any>[]
}

export enum PageType {
  TEXT = 'text',
  MERMAID = 'mermaid',
  GGB = 'ggb',
}
