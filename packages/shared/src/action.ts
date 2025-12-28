import { BasePage } from "./page"

export interface Action<T, K extends string> {
  type: K
  options: T
  page?: string
}

export interface TaskAction<T, J extends string, K extends object = {}> extends Action<T, 'task'> {
  taskId: string
  taskType: J
  taskOptions: K
}

export interface TaskCompleteAction<T> extends Action<T, 'task-complete'> {
  taskId: string
}

// Base actions

export type TextAction = Action<{ text: string }, 'text'>
export type PageCreateAction = Action<{ page: BasePage }, 'page-create'>

export type ClientAction = TextAction | PageCreateAction | TaskAction<any, any> | TaskCompleteAction<any>
