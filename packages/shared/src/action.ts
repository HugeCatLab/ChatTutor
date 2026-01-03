import { Page } from './page'

export interface Action<T, K extends string> {
  type: K
  options: T
  page?: string
}

export interface TaskAction<T, J extends string, K extends object = object> extends Action<T, 'task'> {
  taskId: string
  taskType: J
  taskOptions?: K
}

export interface TaskCompleteAction<T, J extends string> extends Action<T, 'task-complete'> {
  taskId: string
  taskType: J
}

// Base actions

export type TextAction = Action<{ text: string }, 'text'>
export type PageCreateAction = Action<{ page: Page }, 'page-create'>
export type EndAction = Action<object, 'end'>

export type PlanTaskAction = TaskAction<object, 'plan'>
export type PlanCompleteAction = TaskCompleteAction<{ content: string }, 'plan'>

export type NoteTaskAction = TaskAction<object, 'note'>
export type NoteCompleteAction = TaskCompleteAction<{ content: string }, 'note'>
export type NoteAppendAction = Action<{ content: string }, 'note-append'>

export type MermaidTaskAction = TaskAction<object, 'mermaid'>
export type MermaidCompleteAction = TaskCompleteAction<{ content: string }, 'mermaid'>
export type MermaidUpdateAction = Action<{ content: string }, 'mermaid-update'>

export type GGBTaskAction = TaskAction<object, 'ggb'>
export type GGBCompleteAction = TaskCompleteAction<{ content: string }, 'ggb'>
export type GGBScriptExcuteAction = Action<{ content: string }, 'ggbscript-excute'>

export type ClientAction =
  | TextAction
  | PageCreateAction
  | EndAction
  | PlanTaskAction
  | PlanCompleteAction
  | TaskAction<object, string>
  | TaskCompleteAction<object, string>
  | MermaidUpdateAction
  | MermaidTaskAction
  | MermaidCompleteAction
  | GGBTaskAction
  | GGBCompleteAction
  | GGBScriptExcuteAction
  | NoteTaskAction
  | NoteCompleteAction
  | NoteAppendAction
