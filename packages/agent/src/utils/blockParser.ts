import { PageType, type Action, type FullAction, type Page } from '@chat-tutor/shared'
import type {
  PageCreationAction,
  NoteStartAction,
  NoteEndAction,
  MermaidStartAction,
  MermaidEndAction,
  GGBStartAction,
  GGBEndAction,
  PlanStartAction,
  PlanEndAction,
} from '@chat-tutor/agent'
import type { MermaidPage } from './mermaid'
import { mermaidBlockResolver } from './mermaid'
import { noteBlockResolver } from './note'
import { ggbBlockResolver } from './ggb'

export type BlockResolver = (context: {
  page: Page
  content: string
}, emit: Emit) => Action | FullAction

type Emit = (action: FullAction | PageCreationAction) => void

export interface BlockParserOptions {
  pages: Page[]
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
    pageType: PageType
  }>()

  blockResolvers.set('mermaid', {
    resolver: mermaidBlockResolver,
    pageType: PageType.MERMAID,
  })
  blockResolvers.set('note', {
    resolver: noteBlockResolver,
    pageType: PageType.TEXT,
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
        type: 'plan-start',
        options: {},
      } as PlanStartAction)
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
          type: 'plan-end',
          options: { content: planContent },
        } as PlanEndAction)
        planContent = ''
        return true
      }
    }

    return false
  }

  // Check if page exists, if not create it
  const ensurePage = (id: string, type: string, title?: string) => {
    let page = pages.find(p => p.id === id)
    if (!page) {
      page = {
        id,
        title: title || 'Untitled',
        type,
        steps: [],
        notes: [],
      }
      pages.push(page)
      emit({
        type: 'page',
        options: page,
      } as PageCreationAction<MermaidPage>)
    }
    return page
  }

  // Emit start action for a block
  const emitStartAction = (blockType: string, pageId: string) => {
    if (blockType === 'note') {
      emit({
        type: 'note-start',
        options: { page: pageId },
        page: pageId,
      } as NoteStartAction)
    } else if (blockType === 'mermaid') {
      emit({
        type: 'mermaid-start',
        options: { page: pageId },
        page: pageId,
      } as MermaidStartAction)
    } else if (blockType === 'ggbscript' || blockType === 'geogebra') {
      emit({
        type: 'ggb-start',
        options: { page: pageId },
        page: pageId,
      } as GGBStartAction)
    }
  }

  // Emit end action for a block
  const emitEndAction = (blockType: string, pageId: string) => {
    if (blockType === 'note') {
      emit({
        type: 'note-end',
        options: { page: pageId },
        page: pageId,
      } as NoteEndAction)
    } else if (blockType === 'mermaid') {
      emit({
        type: 'mermaid-end',
        options: { page: pageId },
        page: pageId,
      } as MermaidEndAction)
    } else if (blockType === 'ggbscript' || blockType === 'geogebra') {
      emit({
        type: 'ggb-end',
        options: { page: pageId },
        page: pageId,
      } as GGBEndAction)
    }
  }

  // Complete the mermaid block
  const finishBlock = (content: string) => {
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
    const page = ensurePage(block.page, pageType, block.title)
    // Emit the actual action with data (this will be added to steps)
    resolver({ page, content: trimmedContent }, emit)
    // Emit end action
    emitEndAction(block.type, block.page)
    blockMeta = null
  }
      
  // Parse mermaid blocks
  const tryParse = () => {
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
        ensurePage(pageId, resolverInfo.pageType, title)
      }
      // Emit start action when block starts
      emitStartAction(type, pageId)
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
    finishBlock(content)
    state = 'idle'
  }

  return {
    handle(action: FullAction) {
      if (action.type !== 'text') {
        emit(action)
        return
      }
      buffer += action.options.chunk
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
