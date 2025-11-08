import type { Page, PageType, FullAction } from '@chat-tutor/shared'
import type { CodePageSetActionOptions, CodePageInsertBeforeActionOptions, CodePageInsertAfterActionOptions, CodePageRemoveActionOptions } from './action'

export type CodePage = Page<CodePageAction, PageType.CODE>

export type CodePageAction = FullAction<typeof CodePageSetActionOptions.infer, PageType.CODE> | FullAction<typeof CodePageInsertBeforeActionOptions.infer, PageType.CODE> | FullAction<typeof CodePageInsertAfterActionOptions.infer, PageType.CODE> | FullAction<typeof CodePageRemoveActionOptions.infer, PageType.CODE>