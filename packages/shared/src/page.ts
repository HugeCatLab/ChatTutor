import { Action } from './action'

export interface BasePage {
  id: string
  title: string
  type: string
  steps: Action<object, string>[]
}

export enum PageType {
  MERMAID = 'mermaid',
  GGB = 'ggb',
}

export interface GGBPage extends BasePage {
  type: PageType.GGB
}

export interface MermaidPage extends BasePage {
  type: PageType.MERMAID
}

export type Page = GGBPage | MermaidPage
