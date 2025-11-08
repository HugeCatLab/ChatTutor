import type { Action, FullAction } from './action'

export enum PageType {
  TEXT = 'text',
  CANVAS = 'canvas',
  PAGE = 'page',
  MERMAID = 'mermaid',
  CODE = 'code',
}

export interface Page<T extends Action = FullAction, A extends string = string> {
  type: A
  title: string
  id?: string
  steps: T[]
  notes: string[]
}
