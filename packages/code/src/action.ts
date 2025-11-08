import type { ActionResolver} from '@chat-tutor/shared';
import { BaseAction } from '@chat-tutor/shared'
import { type } from 'arktype'

const content = type.string.array().describe('The code lines.')

// set

export const CodePageSetActionOptions = type({
  content,
})

export const CodePageSetAction = type.and(BaseAction, type({
  options: CodePageSetActionOptions
})).describe('Clear up all code and set new code.')

export const codePageSetActionResolver: ActionResolver<typeof CodePageSetAction.infer> = (action) => {
  return {
    success: true,
    action: action.type,
    message: {
      lines: action.options.content.length,
    },
  }
}

// insert

export const CodePageInsertBeforeActionOptions = type({
  content,
  line: type.number.describe('The line number to insert before.'),
}).describe('The code lines to insert before the specified line.')

export const CodePageInsertBeforeAction = type.and(BaseAction, type({
  options: CodePageInsertBeforeActionOptions
}))

export const codePageInsertBeforeActionResolver: ActionResolver<typeof CodePageInsertBeforeAction.infer> = (action) => {
  return {
    success: true,
    action: action.type,
    message: {
      lines: action.options.content.length,
      message: `Insert target line has been updated from line ${action.options.line} to ${action.options.line + action.options.content.length}`,
    },
  }
}

export const codePageInsertAfterActionResolver: ActionResolver<typeof CodePageInsertAfterAction.infer> = (action) => {
  return {
    success: true,
    action: action.type,
    message: {
      lines: action.options.content.length,
    },
  }
}

export const CodePageInsertAfterActionOptions = type({
  content,
  line: type.number.describe('The line number to insert after.'),
}).describe('The code lines to insert after the specified line.')

export const CodePageInsertAfterAction = type.and(BaseAction, type({
  options: CodePageInsertAfterActionOptions
}))

// remove

export const CodePageRemoveActionOptions = type({
  from: type.number.describe('The line number to remove from.'),
  to: type.number.describe('The line number to remove to. If not specified, only the line at from will be removed.').optional(),
}).describe('The code lines to remove the specified line.')

export const CodePageRemoveAction = type.and(BaseAction, type({
  options: CodePageRemoveActionOptions
}))

export const codePageRemoveActionResolver: ActionResolver<typeof CodePageRemoveAction.infer> = (action) => {
  return {
    success: true,
    action: action.type,
    message: {
      from: action.options.from,
      to: action.options.to,
      message: `First line after code removed has been updated from line ${(action.options.to ?? action.options.from) + 1} to ${action.options.from}`
    },
  }
}
