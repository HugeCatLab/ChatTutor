import type { Action, FullizeAction, Page } from '@chat-tutor/shared'
import { PageType } from '@chat-tutor/shared'
import type { Tool, Message } from 'xsai'
import { tool } from 'xsai'
import { type } from 'arktype'
import type { CanvasPage, DocumentAction } from '@chat-tutor/canvas'
import type { MermaidPage, MermaidPageAction } from '@chat-tutor/mermaid'
import { createPainterAgent } from '../painter'
import type { AgentChunker } from '../types'
import type { PageCreationAction, PageNoteAction } from '..'

export type CanvasPageDrawStartAction = Action<{
  page: string
  input: string
}, 'draw-start'>
export type CanvasPageDrawEndAction = Action<{
  page: string
  result: string
}, 'draw-end'>

export const getAgentTools = async (
  { pages, painterOptions, chunker }: {
    pages: Page[]
    painterOptions: {
      apiKey: string
      baseURL: string
      model: string
      messages: Record<string, Message[]>
    }
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
    }),
    execute: async ({ id, title }) => {
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

  // const createMermaid = tool({
  //   name: 'create_mermaid',
  //   description: 'Create a new mermaid page',
  //   parameters: type({
  //     id: 'string',
  //     title: 'string',
  //   }),
  //   execute: async ({ id, title }) => {
  //     const result = checkExist(id)
  //     if (result) {
  //       return result
  //     }
  //     const p: MermaidPage = {
  //       id,
  //       title,
  //       type: PageType.MERMAID,
  //       steps: [],
  //       notes: [],
  //     }
  //     pages.push(p)
  //     chunker({
  //       type: 'page',
  //       options: p,
  //     } as PageCreationAction<MermaidPage>)
  //     return {
  //       success: true,
  //       message: 'Page created successfully',
  //       page: id,
  //     }
  //   },
  // })

  // const setMermaid = tool({
  //   name: 'set_mermaid',
  //   description: 'Set the mermaid on a page',
  //   parameters: type({
  //     page: type('string').describe('The page id to set the mermaid on'),
  //     content: type('string').describe('The mermaid code to set on the page'),
  //   }),
  //   execute: async ({ page, content }) => {
  //     const targetPage = pages.find(p => p.id === page)
  //     if (!targetPage) {
  //       return {
  //         success: false,
  //         message: 'Page not found',
  //       }
  //     }
  //     const action: FullizeAction<MermaidPageAction> = {
  //       type: 'set-mermaid',
  //       options: { content },
  //       page: targetPage.id,
  //     }
  //     targetPage.steps.push(action)
  //     chunker(action)
  //     return {
  //       success: true,
  //       message: 'Mermaid set successfully',
  //       page: targetPage.id,
  //     }
  //   },
  // })

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
      chunker({
        type: 'draw-start',
        options: { page, input },
      } as CanvasPageDrawStartAction)
      const targetPage = pages.find(p => p.id === page)
      if (!targetPage) {
        return {
          success: false,
          message: 'Page not found',
        }
      }
      painterOptions.messages[targetPage.id!] ??= []
      const painter = createPainterAgent({
        ...painterOptions,
        messages: painterOptions.messages[targetPage.id!],
      })
      const result = await painter(input)
      const action = {
        type: 'document',
        options: { content: result },
        page,
      } as DocumentAction
      chunker(action)
      targetPage.steps.push(action)
      chunker({
        type: 'draw-end',
        options: { page, result },
      } as CanvasPageDrawEndAction)
      return {
        success: true,
        message: result,
      }
    },
  })

  // return await Promise.all([createCanvas, createMermaid, setMermaid, note, draw]) as Tool[]
  return await Promise.all([createCanvas, note, draw]) as Tool[]
}