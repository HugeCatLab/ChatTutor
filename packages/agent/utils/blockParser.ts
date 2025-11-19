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

const mermaidStart = /```(?:\s*)(mermaid|note)(?:\s+)([^\s`|]+)(?:\|([^\n`]+))?/i
const mermaidEnd = /^```[\t ]*$/m

export const createBlockParser = ({ pages, emit, emitText }: BlockParserOptions) => {
  let buffer = ''
  // TODO: extend to note and code etc...
  let blockMeta: BlockMeta | null = null
  
  const flushText = () => {
    if (buffer.length === 0) return
    emitText(buffer)
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

  const finishBlock = () => {
    if (!blockMeta) return
    const block = blockMeta as BlockMeta
    const content = buffer.trim()
    buffer = ''
    if (block.type === 'mermaid') {
      const page = ensurePage(block.page, block.title, PageType.MERMAID) as MermaidPage
      const action: FullizeAction<MermaidPageAction> = {
        type: 'set-mermaid',
        options: { content },
        page: block.page,
      }
      page.steps.push(action)
      emit(action)
      blockMeta = null
    }
  }
      
  // Parse mermaid blocks
  const tryParse = () => {
    if (!blockMeta) {
      const match = buffer.match(mermaidStart)
      if (!match) return
      const [prefix, type, page, title] = match
      const idx = buffer.indexOf(prefix)
      const before = buffer.slice(0, idx)
      if (before) emitText(before)
      buffer = buffer.slice(idx + prefix.length)
      blockMeta = { type: type as BlockMeta['type'], page, title }
      return
    }

    const endIdx = buffer.search(mermaidEnd)
    if (endIdx === -1) return
    const content = buffer.slice(0, endIdx)
    buffer = buffer.slice(endIdx)
    finishBlock()
    buffer = buffer.replace(mermaidEnd, '')
  }

  return {
    handle(action: FullAction) {
      if (action.type !== 'text') {
        emit(action)
        return
      }
      buffer += action.options.chunk
      while (true) {
        const prev = buffer
        tryParse()
        if (buffer === prev) break
      }
      if (!blockMeta) flushText()
    }
  }
}
