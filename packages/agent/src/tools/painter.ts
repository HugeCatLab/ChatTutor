import type { CanvasPage } from '@chat-tutor/canvas'
import type { Tool } from 'xsai'
import { tool } from 'xsai'
import { type } from 'arktype'
import type { Action, FullizeAction } from '@chat-tutor/shared'
import type { AgentChunker } from '../types'

export type CanvasPageUpdateAction = Action<{
  range: [number, number]
  domain: [number, number]
}, 'update-canvas'>

export const getPainterTools = async (
  page: CanvasPage,
  chunker: AgentChunker
): Promise<Tool[]> => {

  const element = type({
    name: type.string.describe('The name of the element'),
    id: type.string.describe('The only-one id of the element'),
    attrs: type.object.describe('The attributes of the element'),
  })

  const setCanvas = tool({
    name: 'set_canvas',
    description: 'Set the canvas of the page',
    parameters: type({
      range: type.number.array().describe('The range of the canvas (y axis)'),
      domain: type.number.array().describe('The domain of the canvas (x axis)'),
    }),
    execute: async ({ range, domain }) => {
      page.range = range as [number, number]
      page.domain = domain as [number, number]
      chunker({
        type: 'update-canvas',
        options: { range, domain },
        page: page.id,
      } as FullizeAction<CanvasPageUpdateAction>)
      
      return {
        success: true,
        message: 'Canvas set successfully',
      }
    },
    strict: false,
  })

  const add = tool({
    name: 'add',
    description: 'Add an elements to the page',
    parameters: type({
      elements: element.array().describe('The elements to add to the page'),
    }),
    execute: async ({ elements }) => {
      const actions = elements.map(e => ({
        type: 'element' as const,
        options: e,
      }))
      page.steps.push(...actions)
      for (const action of actions) {
        chunker(action)
      }
      return {
        success: true,
        message: 'Elements added successfully',
        elements: elements.length,
      }
    },
    strict: false,
  })

  return Promise.all([add, setCanvas])
}