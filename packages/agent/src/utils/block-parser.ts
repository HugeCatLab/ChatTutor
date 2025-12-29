import { mermaidBlockResolver } from './mermaid'
import { noteBlockResolver } from './note'
import { ggbBlockResolver } from './ggb'
import { PageType } from '@chat-tutor/shared'
import type { BasePage, Action, PlanTaskAction, PlanCompleteAction, PageCreateAction, NoteTaskAction, MermaidTaskAction, GGBTaskAction, ClientAction, NoteCompleteAction } from '@chat-tutor/shared'
import { MermaidCompleteAction } from '@chat-tutor/shared'
import { GGBCompleteAction } from '@chat-tutor/shared'

export type BlockResolver = (context: {
  page: BasePage
  content: string
}, emit: Emit) => Action<any, any> | void

type Emit = (action: ClientAction | void) => void

export interface BlockParserOptions {
  pages: BasePage[]
  emit: Emit                // create page / set-mermaid etc TODO: set note
  emitText: (chunk: string) => void // 继续输出普通文本
}

type BlockMeta = {
  type: string
  page: string
  title?: string
}

const fenceStart = '```'
const blockStart = /^```\s*(mermaid|note|ggbscript|geogebra)\s*\[([^\]\s|;]+)(?:;([^\]]+))?\](?:\|([^\n`]+))?[\t ]*(?:\r?\n)?/m
const blockEnd = /^```[\t ]*(?:\r?\n)?/

// Plan tag patterns
const planStartTag = '<plan>'
const planEndTag = '</plan>'

export const createBlockParser = ({ pages, emit, emitText }: BlockParserOptions) => {
  const blockResolvers = new Map<string, {
    resolver: BlockResolver
    pageType?: PageType
  }>()

  blockResolvers.set('mermaid', {
    resolver: mermaidBlockResolver,
    pageType: PageType.MERMAID,
  })
  blockResolvers.set('note', {
    resolver: noteBlockResolver
  })
  blockResolvers.set('ggbscript', {
    resolver: ggbBlockResolver,
    pageType: PageType.GGB,
  })
  blockResolvers.set('geogebra', {
    resolver: ggbBlockResolver,
    pageType: PageType.GGB,
  })
  let buffer = ''
  // TODO: extend to note and code etc...
  let blockMeta: BlockMeta | null = null
  type State = 'idle' | 'await_head' | 'in_block' | 'in_plan'
  let state: State = 'idle'
  
  const flushPlainText = () => {
    if (!buffer || blockMeta) return

    // Check for partial fence at end of buffer
    // Only if we are not inside a block (where we wait for end fence)
    // But wait, if we are inside a block, we are buffering content until ```
    // So flushPlainText is mainly for 'idle' state or 'await_head' (before fence found)

    let keepLen = 0
    if (state === 'idle') {
      if (buffer.endsWith('``')) keepLen = 2
      else if (buffer.endsWith('`')) keepLen = 1
      // Also check for partial <plan or </plan tags
      else if (buffer.endsWith('<plan')) keepLen = 5
      else if (buffer.endsWith('<pla')) keepLen = 4
      else if (buffer.endsWith('<pl')) keepLen = 3
      else if (buffer.endsWith('<p')) keepLen = 2
      else if (buffer.endsWith('<')) keepLen = 1
    }

    const textToEmit = buffer.slice(0, buffer.length - keepLen)
    const keptText = buffer.slice(buffer.length - keepLen)

    if (textToEmit.length > 0) {
      emitText(textToEmit)
    }
    buffer = keptText
  }

  // Store plan content for expand
  let planContent = ''

  // Try to parse plan tags
  const tryParsePlan = (): boolean => {
    // Check for <plan> start tag
    const taskId = crypto.randomUUID()
    const planStartIdx = buffer.indexOf(planStartTag)
    if (planStartIdx !== -1 && state === 'idle') {
      // Emit text before plan tag
      if (planStartIdx > 0) {
        const textBefore = buffer.slice(0, planStartIdx)
        if (textBefore.length > 0) {
          emitText(textBefore)
        }
      }
      // Remove the <plan> tag from buffer
      buffer = buffer.slice(planStartIdx + planStartTag.length)
      state = 'in_plan'
      planContent = ''
      // Emit plan-start action
      emit({
        type: 'task',
        taskId,
        taskType: 'plan',
      } as PlanTaskAction)
      return true
    }

    // Check for </plan> end tag when in plan state
    if (state === 'in_plan') {
      const planEndIdx = buffer.indexOf(planEndTag)
      if (planEndIdx !== -1) {
        // Save content inside plan for expand
        planContent = buffer.slice(0, planEndIdx).trim()
        buffer = buffer.slice(planEndIdx + planEndTag.length)
        state = 'idle'
        // Emit plan-end action with content
        emit({
          type: 'task-complete',
          options: { content: planContent },
          taskId,
          taskType: 'plan',
        } as PlanCompleteAction)
        planContent = ''
        return true
      }
    }

    return false
  }

  // Check if page exists, if not create it
  const ensurePage = (id: string, type: string | null, title?: string) => {
    let page = pages.find(p => p.id === id)
    if (!type) return page!
    if (!page) {
      page = {
        id,
        title: title || 'Untitled',
        type,
        steps: [],
      }
      pages.push(page)
      emit({
        type: 'page-create',
        options: { page },
      } satisfies PageCreateAction)
    }
    return page
  }

  // Emit start action for a block
  const emitStartAction = (blockType: string, pageId: string, taskId: string) => {
    if (blockType === 'note') {
      emit({
        type: 'task',
        taskId,
        taskType: 'note',
        options: { content: '' },
        page: pageId,
      } as NoteTaskAction)
    } else if (blockType === 'mermaid') {
      emit({
        type: 'task',
        taskId,
        taskType: 'mermaid',
        options: { content: '' },
      } satisfies MermaidTaskAction)
    } else if (blockType === 'ggbscript' || blockType === 'geogebra') {
      emit({
        type: 'task',
        taskId,
        taskType: 'ggb',
        options: { content: '' },
      } satisfies GGBTaskAction)
    }
  }

  // Emit end action for a block
  const emitEndAction = (blockType: string, pageId: string, taskId: string) => {
    if (blockType === 'note') {
      emit({
        type: 'task-complete',
        options: { content: '' },
        taskId,
        taskType: 'note',
        page: pageId,
      } satisfies NoteCompleteAction)
    } else if (blockType === 'mermaid') {
      emit({
        type: 'task-complete',
        options: { content: '' },
        taskId,
        taskType: 'mermaid',
        page: pageId,
      } satisfies MermaidCompleteAction)
    } else if (blockType === 'ggbscript' || blockType === 'geogebra') {
      emit({
        type: 'task-complete',
        options: { content: '' },
        taskId,
        taskType: 'ggb',
        page: pageId,
      } satisfies GGBCompleteAction)
    }
  }

  // Complete the mermaid block
  const finishBlock = (content: string, taskId: string) => {
    if (!blockMeta) return
    const block = blockMeta as BlockMeta
    const trimmedContent = content.trimEnd()
    // debug: Check finished block content
    // Ignore empty block
    if (trimmedContent.length === 0) {
      blockMeta = null
      console.warn('Empty block content, ignored.')
      return
    }
    // Handle mermaid block
    const { resolver, pageType } = blockResolvers.get(block.type)!
    if (!resolver) {
      return blockMeta = null
    }
    const page = ensurePage(block.page, pageType || null, block.title)
    // Emit the actual action with data (this will be added to steps)
    resolver({ page, content: trimmedContent }, emit)
    // Emit end action
    emitEndAction(block.type, block.page, taskId)
    blockMeta = null
  }
      
  const tryParse = () => {
    const taskId = crypto.randomUUID()
    if (!blockMeta) {
      const fenceIdx = buffer.indexOf(fenceStart)
      if (fenceIdx === -1 && state === 'idle') {
        flushPlainText()
        return
      } else {
        // Enter await_head state
        state = 'await_head'
      }
      // Flush text before fence
      if (fenceIdx > 0) {
        const textBeforeFence = buffer.slice(0, fenceIdx)
        if (textBeforeFence.length > 0) {
          emitText(textBeforeFence)
        }
        buffer = buffer.slice(fenceIdx)
      }
      // Match mermaid head
      const headMatch = buffer.match(blockStart)
      // Not get the full head yet
      if (!headMatch || headMatch.index !== 0) return
      // Full head matched, extract page meta info
      state = 'in_block'
      const [prefix, type, pageId, title] = headMatch
      buffer = buffer.slice(prefix.length)
      blockMeta = { type: type as BlockMeta['type'], page: pageId, title }
      // Ensure page exists before emitting start action
      const resolverInfo = blockResolvers.get(type)
      if (resolverInfo) {
        ensurePage(pageId, resolverInfo.pageType || null, title)
      }
      // Emit start action when block starts
      emitStartAction(type, pageId, taskId)
      return
    }
    // Inside a block, look for end fence
    const endIdx = buffer.indexOf(fenceStart)
    // If not find the second ````, wait for more content
    if (endIdx === -1) return
    // Found the end fence
    const content = buffer.slice(0, endIdx)
    const tail = buffer.slice(endIdx)
    const endMatch = tail.match(blockEnd)
    if (!endMatch || endMatch.index !== 0) return
    // Full block matched
    buffer = tail.slice(endMatch[0].length)
    finishBlock(content, taskId)
    state = 'idle'
  }

  return {
    handle(action: ClientAction) {
      if (action.type !== 'text') {
        emit(action)
        return
      }
      buffer += action.options.text
      // debug: Check buffer content
      // console.log('buffer updated:', buffer)
      while (true) {
        const prev = buffer
        // Try plan parsing first
        if (tryParsePlan()) continue
        // Skip regular parsing when inside plan
        if (state !== 'in_plan') {
          tryParse()
        }
        if (buffer === prev) break
      }
      if (state === 'idle') flushPlainText()
    }
  }
}
