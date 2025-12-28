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

export interface ErrorClientMessage extends BaseClientMessage {
  type: 'error'
  error: string
}

export type ClientMessage = UserClientMessage | AgentClientMessage | PageCreateClientMessage | ErrorClientMessage | DelayedClientMessage

// Utils

export const isDelayedMessage = (message: ClientMessage): message is DelayedClientMessage => {
  return 'running' in message && 'taskId' in message
}
