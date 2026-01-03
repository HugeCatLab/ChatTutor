import type { GGBScriptExcuteAction  } from '@chat-tutor/shared'
import type { BlockResolver } from './block-parser'

export const ggbBlockResolver: BlockResolver = ({ page, content }, emit) => {
  const action: GGBScriptExcuteAction = {
    type: 'ggbscript-excute',
    options: { content },
    page: page.id,
  }
  page.steps.push(action)
  emit(action)
  return action
}