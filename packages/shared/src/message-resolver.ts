import { ClientAction } from './action'
import { AgentClientMessage, ClientMessage, GGBClientMessage, isDelayedMessage, MermaidClientMessage, NoteClientMessage, PageCreateClientMessage, PlanClientMessage, TaskClientMessage, UserClientMessage } from './client-message'
import { UserAction } from './user-action'

export interface MessageResolverOptions {
  get: () => ClientMessage[]
  push: (message: ClientMessage) => void
  uuid: () => string
}

export const createMessageResolver = ({ get, push, uuid }: MessageResolverOptions) => {
  const findTaskRelatedMessage = (taskId: string) => {
    const messages = get()
    return messages.find(message => isDelayedMessage(message) && message.taskId === taskId)
  }

  return (action: ClientAction | UserAction) => {
    const messages = get()
    switch (action.type) {
      case 'user-input':
        push({
          type: 'user',
          id: uuid(),
          content: action.options.prompt,
        } satisfies UserClientMessage)
        break
      case 'text':
        const shouldCreate = messages.at(-1)?.type !== 'agent'
        if (shouldCreate) {
          push({
            type: 'agent',
            id: uuid(),
            content: '',
          })
        }
        (<AgentClientMessage>messages.at(-1)).content += action.options.text
        break
      case 'task':
        switch (action.taskType) {
          case 'plan':
            push({
              type: 'plan',
              id: uuid(),
              content: '',
              running: true,
              taskId: action.taskId,
            } satisfies PlanClientMessage)
            break
          case 'note':
            push({
              type: 'note',
              id: uuid(),
              content: '',
              running: true,
              taskId: action.taskId,
            } satisfies NoteClientMessage)
            break
          case 'mermaid':
            push({
              type: 'mermaid',
              id: uuid(),
              content: '',
              running: true,
              taskId: action.taskId,
            } satisfies MermaidClientMessage)
            break
          case 'ggb':
            push({
              type: 'ggb',
              id: uuid(),
              content: '',
              running: true,
              taskId: action.taskId,
            } satisfies GGBClientMessage)
            break
        }
        break
      case 'task-complete':
        const taskMessage = findTaskRelatedMessage(action.taskId) as TaskClientMessage
        taskMessage.running = false
        const content = (action.options as { content: string }).content
        taskMessage.content = content
        break
      case 'page-create':
        push({
          type: 'page-create',
          id: uuid(),
          page: action.options.page.id,
          title: action.options.page.title,
        } satisfies PageCreateClientMessage)
        break
    }
    return action
  }
}