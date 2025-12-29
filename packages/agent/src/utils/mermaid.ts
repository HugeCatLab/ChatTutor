import type { BlockResolver } from './block-parser'
import type { MermaidUpdateAction } from '@chat-tutor/shared'

export const mermaidBlockResolver: BlockResolver = ({ page, content }, emit) => {
  const action: MermaidUpdateAction = {
    type: 'mermaid-update',
    options: { content: content },
    page: page.id,
  }
  page.steps.push(action)
  emit(action)
  return action
}