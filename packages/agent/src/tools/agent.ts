import type { FullizeAction, Page } from '@chat-tutor/shared'
import { PageType } from '@chat-tutor/shared'
import type { Tool } from 'xsai'
import { tool } from 'xsai'
import { type } from 'arktype'
import type { CanvasPage, CanvasPageAction } from '@chat-tutor/canvas'
import type { MermaidPage, MermaidPageAction } from '@chat-tutor/mermaid'
import { createPainterAgent, type PainterAgentOptions } from '../painter'
import type { AgentChunker } from '../types'
import type { PageCreationAction, PageNoteAction } from '..'

export const getAgentTools = async (
  { pages, painterOptions, chunker }: {
    pages: Page[]
    painterOptions: Omit<PainterAgentOptions, 'page'>
    chunker: AgentChunker
  }
) => {
  const checkExist = (id: string) => {
    if (pages.find(page => page.id === id)) {
      return {
        success: false,
        message: 'Page already exists',
      }
    }
  }
  const createCanvas = tool({
    name: 'create_canvas',
    description: 'Create a new canvas page',
    parameters: type({
      id: 'string',
      title: 'string',
      axis: type.boolean.describe('Whether to show the axis').default(false),
      grid: type.boolean.describe('Whether to show the grid').default(false),
    }),
    execute: async ({ id, title, axis, grid }) => {
      const result = checkExist(id)
      if (result) {
        return result
      }
      const p: CanvasPage = {
        id,
        title,
        type: PageType.CANVAS,
        steps: [],
        notes: [],
        range: [0, 0],
        domain: [0, 0],
        axis: axis ?? false,
        grid: grid ?? false,
      }
      pages.push(p)

      chunker({
        type: 'page',
        options: p,
      } as PageCreationAction<CanvasPage>)
      return {
        success: true,
        message: 'Page created successfully',
        page: id,
      }
    },
    strict: false
  })

  const createMermaid = tool({
    name: 'create_mermaid',
    description: 'Create a new mermaid page',
    parameters: type({
      id: 'string',
      title: 'string',
    }),
    execute: async ({ id, title }) => {
      const result = checkExist(id)
      if (result) {
        return result
      }
      const p: MermaidPage = {
        id,
        title,
        type: PageType.MERMAID,
        steps: [],
        notes: [],
      }
      pages.push(p)
      chunker({
        type: 'page',
        options: p,
      } as PageCreationAction<MermaidPage>)
      return {
        success: true,
        message: 'Page created successfully',
        page: id,
      }
    },
  })

  const setMermaid = tool({
    name: 'set_mermaid',
    description: 'Set the mermaid on a page',
    parameters: type({
      page: type('string').describe('The page id to set the mermaid on'),
      content: type('string').describe('The mermaid code to set on the page'),
    }),
    execute: async ({ page, content }) => {
      const targetPage = pages.find(p => p.id === page)
      if (!targetPage) {
        return {
          success: false,
          message: 'Page not found',
        }
      }
      const action: FullizeAction<MermaidPageAction> = {
        type: 'set-mermaid',
        options: { content },
        page: targetPage.id,
      }
      targetPage.steps.push(action)
      chunker(action)
      return {
        success: true,
        message: 'Mermaid set successfully',
        page: targetPage.id,
      }
    },
  })

  const note = tool({
    name: 'note',
    description: 'Add markdown note on a page',
    parameters: type({
      page: type('string').describe('The page to note'),
      content: type('string').describe('The markdown content to add on the page note area.'),
    }),
    execute: async ({ page, content }) => {
      const targetPage = pages.find(p => p.id === page)
      if (!targetPage) {
        return {
          success: false,
          message: 'Page not found',
        }
      }
      targetPage.notes.push(content)
      const action: PageNoteAction = {
        type: 'note',
        options: { content },
        page: targetPage.id,
      }
      chunker(action)
      return {
        success: true,
        message: 'Note added successfully',
        page: page,
      }
    },
    strict: false
  })

  const draw = tool({
    name: 'draw',
    description: 'Draw on a page with natural language use painter sub-agent',
    parameters: type({
      page: type('string').describe('The page id to draw on'),
      input: type('string').describe('The natural language input to draw on the page'),
    }),
    execute: async ({ page, input }) => {
      const targetPage = pages.find(p => p.id === page)
      if (!targetPage) {
        return {
          success: false,
          message: 'Page not found',
        }
      }
      const painter = createPainterAgent({
        ...painterOptions,
        page: targetPage as CanvasPage,
      })
      const result = await painter(input, (chunk) => {
        const fullChunk: FullizeAction<CanvasPageAction> = {
          ...(chunk as CanvasPageAction),
          page: targetPage.id,
        }
        chunker(fullChunk)
      })
      return {
        success: true,
        message: result,
      }
    },
  })

  return await Promise.all([createCanvas, createMermaid, setMermaid, note, draw]) as Tool[]
}