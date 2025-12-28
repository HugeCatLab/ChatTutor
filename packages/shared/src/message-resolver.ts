import { ClientAction } from "./action"
import { AgentClientMessage, ClientMessage, isDelayedMessage, PageCreateClientMessage } from "./client-message"

export interface MessageResolverOptions {
  messages: ClientMessage[]
  uuid: () => string
}

export const createMessageResolver = (options: MessageResolverOptions) => {
  const findTaskRelatedMessage = (taskId: string) => {
    return options.messages.find(message => isDelayedMessage(message) && message.taskId === taskId)
  }

  return (action: ClientAction) => {
    switch (action.type) {
      case 'text':
        const shouldCreate = options.messages.at(-1)?.type !== 'agent'
        if (shouldCreate) {
          options.messages.push({
            type: 'agent',
            id: options.uuid(),
            content: action.options.text,
          })
        }
        ; (<AgentClientMessage>options.messages.at(-1)).content += action.options.text
        break
      case 'task':
        const taskMessage = findTaskRelatedMessage(action.taskId)
        switch (action.taskType) {
          // TODO: Implement task type handling
        }
        break
      case 'page-create':
        options.messages.push({
          type: 'page-create',
          id: options.uuid(),
          page: action.options.page.id,
          title: action.options.page.title,
        } satisfies PageCreateClientMessage)
        break
    }
    return action
  }
}