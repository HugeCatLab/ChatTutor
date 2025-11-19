import type { FullAction, FullizeAction, Page } from '@chat-tutor/shared'
import type { PageCreationAction } from '@chat-tutor/agent'
import { PageType } from '@chat-tutor/shared'
import { MermaidPage, MermaidPageAction } from '@chat-tutor/mermaid'

type Emit = (action: FullAction | PageCreationAction) => void

export interface BlockParserOptions {
  pages: Page[]
  emit: Emit                // create page / set-mermaid etc TODO: set note
  emitText: (chunk: string) => void // 继续输出普通文本
}

type BlockMeta = {
  type: 'mermaid' | 'note'
  page: string
  title?: string
}

const fenceStart = '```'
const mermaidStart = /^```(mermaid|note)\[([^\]\s|;]+)(?:;([^\]]+))?\](?:\|([^\n`]+))?/m
const mermaidEnd = /^```[\t ]*(?:\r?\n)?/

export const createBlockParser = ({ pages, emit, emitText }: BlockParserOptions) => {
  let buffer = ''
  // TODO: extend to note and code etc...
  let blockMeta: BlockMeta | null = null
  type State = 'idle' | 'await_head' | 'in_block'
  let state: State = 'idle'
  
  const flushPlainText = () => {
    if (!buffer || blockMeta) return
    const trimmedText = buffer.trim()
    if (trimmedText && trimmedText.length > 0) {
      emitText(trimmedText)
    }
    buffer = ''
  }

  // Check if page exists, if not create it
  const ensurePage = (id: string, title?: string, type = PageType.MERMAID) => {
    let page = pages.find(p => p.id === id)
    if (!page) {
      page = {
        id,
        title: title || 'Untitled',
        type: PageType.MERMAID,
        steps: [],
        notes: [],
        forms: [],
      }
      pages.push(page)
      // Emit page creation action
      emit({
        type: 'page',
        options: page,
      } as PageCreationAction<MermaidPage>)
    }
    return page
  }

  // Complete the mermaid block
  const finishBlock = (content: string) => {
    if (!blockMeta) return
    const block = blockMeta as BlockMeta
    const trimmedContent = content.trimEnd()
    // debug: Check finished block content
    console.log('Finished block:', block, 'with content:', trimmedContent)
    // Ignore empty block
    if (trimmedContent.length === 0) {
      blockMeta = null
      console.warn('Empty block content, ignored.')
      return
    }
    // Handle mermaid block
    if (block.type === 'mermaid') {
      const page = ensurePage(block.page, block.title, PageType.MERMAID) as MermaidPage
      const action: FullizeAction<MermaidPageAction> = {
        type: 'set-mermaid',
        options: { content: trimmedContent },
        page: block.page,
      }
      page.steps.push(action)
      emit(action)
      // For debug purpose, also output the mermaid content as text
      // emitText(trimmedContent)
    }
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
      console.log('Found fence at index:', fenceIdx)
      if (fenceIdx > 0) {
        const trimmedText = buffer.slice(0, fenceIdx).trim()
        if (trimmedText && trimmedText.length > 0) {
          emitText(buffer.slice(0, fenceIdx))
          buffer = buffer.slice(fenceIdx)
        }
      }
      // Match mermaid head
      const headMatch = buffer.match(mermaidStart)
      // Not get the full head yet
      if (!headMatch || headMatch.index !== 0) return
      // Full head matched, extract page meta info
      state = 'in_block'
      const [prefix, type, pageId, title] = headMatch
      buffer = buffer.slice(prefix.length)
      blockMeta = { type: type as BlockMeta['type'], page: pageId, title }
      return
    }
    // Inside a block, look for end fence
    const endIdx = buffer.indexOf(fenceStart)
    // If not find the second ````, wait for more content
    if (endIdx === -1) return
    // Found the end fence
    const content = buffer.slice(0, endIdx)
    const tail = buffer.slice(endIdx)
    const endMatch = tail.match(mermaidEnd)
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
        tryParse()
        if (buffer === prev) break
      }
      if (state === 'idle') flushPlainText()
    }
  }
}
