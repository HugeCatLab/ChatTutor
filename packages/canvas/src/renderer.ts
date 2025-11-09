import { JSXGraph } from 'jsxgraph'
import type { CanvasPageAction } from './page'
import type { ElementAction } from './element'
import { structures } from './elements'
import type { ElementStructor, ElementGetter } from './element-structor'

export type { ElementStructor, ElementGetter }
export { defineElement } from './element-structor'
export type ElementPool = Map<string, unknown>
export const elements = new Map<string, ElementStructor>()
export const registerElement = <T extends object>(name: string, constructor: ElementStructor<T>) => {
  elements.set(name, <ElementStructor<object>>constructor)
}

structures.forEach(([name, constructor]) => registerElement(name, constructor))

export interface CanvasRendererOptions {
  range: [number, number]
  domain: [number, number]
  axis?: boolean
  grid?: boolean
}

export const createCanvasRenderer = (id: string, options: CanvasRendererOptions) => {
  const { range, domain, axis = true, grid = true } = options
  const board = JSXGraph.initBoard(id, {
    boundingBox: [domain[0], range[1], domain[1], range[0]],
    grid,
    axis,
  })
  const pool = new Map<string, unknown>()
  const getElement: ElementGetter = <T = unknown>(id: string) => {
    return pool.get(id) as T
  }

  const processAttrs = (attrs: object): object => {
    const resolveUse = (value: string) => {
      if (typeof value !== 'string') return value
      if (value.trim().startsWith('use(') && value.trim().endsWith(')')) {
        const id = value.trim().slice(4, -1)
        const element = getElement(id)
        if (element) {
          return element
        }
      }
      return value
    }
    return Object.fromEntries(Object.entries(attrs).map(([key, value]) => {
      if (typeof value === 'string') {
        return [key, resolveUse(value)]
      } else if (Array.isArray(value)) {
        const resolved = value.map(resolveUse)
        console.log('resolved', key, resolved)
        return [key, resolved]
      }
      return [key, value]
    }))
  }

  const setBound = (range: [number, number], domain: [number, number]) => {
    board.setBoundingBox([domain[0], range[1], domain[1], range[0]])
  }

  const add = (action: ElementAction) => {
    const element = elements.get(action.options.name)
    if (element) {
      const setup = element(processAttrs(action.options.attrs), getElement)
      pool.set(action.options.id, setup(board))
    }
  }

  const load = (actions: CanvasPageAction[]) => {
    for (const action of actions) {
      try {
        if (action.type === 'element') add(action)
      } catch (error) {
        console.error('Error loading action', action, error)
      }
    }
  }

  return {
    board,
    getElement,
    setBound,
    load,
    add,
  }
}
