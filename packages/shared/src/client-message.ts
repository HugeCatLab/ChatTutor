export interface BaseClientMessage {
  type: string
  id: string
}

export interface ContentClientMessage extends BaseClientMessage {
  content: string
}

export interface DelayedClientMessage extends BaseClientMessage {
  running: boolean
  taskId: string
}

export interface UserClientMessage extends ContentClientMessage {
  type: 'user'
}

export interface AgentClientMessage extends ContentClientMessage {
  type: 'agent'
}

export interface PageCreateClientMessage extends BaseClientMessage {
  type: 'page-create'
  page: string
  title: string
}

export interface PlanClientMessage extends DelayedClientMessage, ContentClientMessage {
  type: 'plan'
}

export interface NoteClientMessage extends DelayedClientMessage, ContentClientMessage {
  type: 'note'
}

export interface MermaidClientMessage extends DelayedClientMessage, ContentClientMessage {
  type: 'mermaid'
}

export interface GGBClientMessage extends DelayedClientMessage, ContentClientMessage {
  type: 'ggb'
}

export interface ErrorClientMessage extends BaseClientMessage {
  type: 'error'
  error: string
}

export type ClientMessage =
  | UserClientMessage
  | AgentClientMessage
  | PageCreateClientMessage
  | PlanClientMessage
  | NoteClientMessage
  | MermaidClientMessage
  | GGBClientMessage
  | ErrorClientMessage
  | DelayedClientMessage

export type TaskClientMessage = 
  | PlanClientMessage
  | NoteClientMessage
  | MermaidClientMessage
  | GGBClientMessage

// Utils

export const isDelayedMessage = (message: ClientMessage): message is DelayedClientMessage => {
  return 'running' in message && 'taskId' in message
}
