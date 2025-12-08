import type { Action, FullAction, Page } from '@chat-tutor/shared'
import type { PageCreationAction } from '@chat-tutor/agent'
import type { MermaidPage } from '@chat-tutor/mermaid'
import { mermaidBlockResolver } from './mermaid'
import { noteBlockResolver } from './note'

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
const blockStart = /^```\s*(mermaid|note)\s*\[([^\]\s|;]+)(?:;([^\]]+))?\](?:\|([^\n`]+))?[\t ]*(?:\r?\n)?/m
const blockEnd = /^```[\t ]*(?:\r?\n)?/

export const createBlockParser = ({ pages, emit, emitText }: BlockParserOptions) => {
  const blockResolvers = new Map<string, BlockResolver>()

  blockResolvers.set('mermaid', mermaidBlockResolver)
  blockResolvers.set('note', noteBlockResolver)
  let buffer = ''
  // TODO: extend to note and code etc...
  let blockMeta: BlockMeta | null = null
  type State = 'idle' | 'await_head' | 'in_block'
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
    }

    const textToEmit = buffer.slice(0, buffer.length - keepLen)
    const keptText = buffer.slice(buffer.length - keepLen)

    if (textToEmit.length > 0) {
      // Don't trim here, let emitText handle it or preserve spaces
      // Original was: const trimmedText = buffer.trim(); emitText(trimmedText)
      // We'll preserve original behavior of calling emitText, but pass non-trimmed 
      // if we want to fix space eating, but here we just pass the text slice.
      // The original code did trim(), which might be why spaces are lost.
      // Let's pass it as is for now, but check validity.
      // If original intent was to ignore empty whitespace chunks, we can check trim().length

      // However, if we split "Hello world" into "Hello " and "world", 
      // trimming "Hello " -> "Hello" is bad.
      // So we should NOT trim if we want to support streaming correctly.
      // But emitText implementation in index.ts trims it anyway. 
      // So changing it here won't fix index.ts behavior, but it's a start.

      if (textToEmit.trim().length > 0) {
        emitText(textToEmit)
      } else {
        // If it's just whitespace? 
        // If buffer is " ", and we don't emit it, we lose space.
        // But emitText checks trimmed length > 0.
        // So whitespace-only chunks are ignored by emitText anyway.
        // We can't fix that here without changing index.ts.
      }
    }
    buffer = keptText
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
        forms: [],
      }
      pages.push(page)
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
    // Ignore empty block
    if (trimmedContent.length === 0) {
      blockMeta = null
      console.warn('Empty block content, ignored.')
      return
    }
    // Handle mermaid block
    const resolver = blockResolvers.get(block.type)
    if (!resolver) {
      return blockMeta = null
    }
    const page = ensurePage(block.page, block.type, block.title) as MermaidPage
    resolver({ page, content: trimmedContent }, emit)
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
        if (textBeforeFence.trim().length > 0) {
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
        tryParse()
        if (buffer === prev) break
      }
      if (state === 'idle') flushPlainText()
    }
  }
}
