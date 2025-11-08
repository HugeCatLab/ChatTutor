import { type Tool, tool } from 'xsai'
import { type } from 'arktype'
import { ElementAction } from '@chat-tutor/canvas'
import type { ActionResolverMap, Page } from '@chat-tutor/shared'
import { MermaidPageSetAction } from '@chat-tutor/mermaid'

const Actions = type.or(ElementAction, MermaidPageSetAction)
const actionResolvers: ActionResolverMap = new Map()

export const getActionTools = async (pages: Page[]) => {
  const act = tool({
    name: 'act',
    description: 'Act on some page',
    parameters: type({
      page: type('string').describe('The page id to act on'),
      actions: Actions.array().describe('The actions to perform on the page'),
    }),
    execute: async ({ page, actions }) => {
      const targetPage = pages.find(p => p.id === page)
      if (!targetPage) {
        return {
          success: false,
          message: 'Page not found',
        }
      }
      targetPage.steps.push(...actions.map(action => ({ ...action, page: targetPage.id })))
      return {
        success: true,
        messages: actions.map(a => {
          const resolver = actionResolvers.get(a.type)
          if (resolver) {
            return resolver(a, targetPage)
          }
          return {
            success: true,
            action: a.type,
          }
        }),
        page: targetPage.id,
        actions: actions.length
      }
    },
    strict: false
  })

  return await Promise.all([act]) as Tool[]
}