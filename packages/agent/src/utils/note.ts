import type { FullizeAction } from '@chat-tutor/shared'
import type { BlockResolver } from './blockParser'
import type { PageNoteAction } from '../index'


export const noteBlockResolver: BlockResolver = ({ page, content }, emit) => {
  const action: FullizeAction<PageNoteAction> = {
    type: 'note',
    options: { content: content },
    page: page.id,
  }
  page.steps.push(action)
  emit(action)
  return action
}