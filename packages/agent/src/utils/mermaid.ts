import type { MermaidPageAction } from '@chat-tutor/mermaid'
import type { BlockResolver } from './blockParser'
import type { FullizeAction } from '@chat-tutor/shared'

export const mermaidBlockResolver: BlockResolver = ({ page, content }, emit) => {
  const action: FullizeAction<MermaidPageAction> = {
    type: 'set-mermaid',
    options: { content: content },
    page: page.id,
  }
  page.steps.push(action)
  emit(action)
  return action
}