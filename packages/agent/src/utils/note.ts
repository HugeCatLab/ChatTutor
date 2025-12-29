import type { NoteAppendAction } from '@chat-tutor/shared'
import type { BlockResolver } from './block-parser'

export const noteBlockResolver: BlockResolver = ({ page, content }, emit) => {
  const action: NoteAppendAction = {
    type: 'note-append',
    options: { content },
    page: page.id,
  } satisfies NoteAppendAction
  page.steps.push(action)
  emit(action)
  return action
}